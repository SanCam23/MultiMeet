const DROPBOX_TOKEN_URL = "https://api.dropboxapi.com/oauth2/token";
const DROPBOX_CONTENT_UPLOAD_URL = "https://content.dropboxapi.com/2/files/upload";
const DROPBOX_LIST_SHARED_LINKS_URL = "https://api.dropboxapi.com/2/sharing/list_shared_links";
const DROPBOX_CREATE_SHARED_LINK_URL = "https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings";
const DROPBOX_GET_SHARED_LINK_METADATA_URL = "https://api.dropboxapi.com/2/sharing/get_shared_link_metadata";
const DROPBOX_DELETE_FILE_URL = "https://api.dropboxapi.com/2/files/delete_v2";

function ensureDirectLink(url) {
  if (!url) {
    return url;
  }

  if (url.includes("raw=1")) {
    return url;
  }

  if (url.includes("dl=0")) {
    return url.replace("dl=0", "raw=1");
  }

  return url;
}

function normalizeSharedLinkForApi(url) {
  if (!url) {
    return url;
  }

  if (url.includes("raw=1")) {
    return url.replace("raw=1", "dl=0");
  }

  return url;
}

function isDropboxUrl(url) {
  return typeof url === "string" && url.includes("dropbox.com");
}

export async function getDropboxAccessToken() {
  if (process.env.DROPBOX_ACCESS_TOKEN) {
    return process.env.DROPBOX_ACCESS_TOKEN;
  }

  const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;
  const appKey = process.env.DROPBOX_APP_KEY;
  const appSecret = process.env.DROPBOX_APP_SECRET;

  if (!refreshToken || !appKey || !appSecret) {
    throw new Error(
      "Faltan credenciales de Dropbox. Define DROPBOX_ACCESS_TOKEN o DROPBOX_REFRESH_TOKEN, DROPBOX_APP_KEY y DROPBOX_APP_SECRET en .env.local"
    );
  }

  const basicAuth = Buffer.from(`${appKey}:${appSecret}`).toString("base64");
  const response = await fetch(DROPBOX_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error_description || "No se pudo obtener el access token de Dropbox");
  }

  return data.access_token;
}

export async function uploadBufferToDropbox({
  buffer,
  fileName,
  folder = process.env.DROPBOX_ROOT_PATH || "/Multimeet",
}) {
  const accessToken = await getDropboxAccessToken();
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const normalizedFolder = folder.startsWith("/") ? folder : `/${folder}`;
  const remotePath = `${normalizedFolder}/${Date.now()}-${safeFileName}`.replace(/\/+/g, "/");

  const uploadResponse = await fetch(DROPBOX_CONTENT_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/octet-stream",
      "Dropbox-API-Arg": JSON.stringify({
        path: remotePath,
        mode: "add",
        autorename: true,
        mute: true,
      }),
    },
    body: buffer,
  });

  const uploadedFile = await uploadResponse.json();

  if (!uploadResponse.ok) {
    throw new Error(uploadedFile?.error_summary || "No se pudo subir el archivo a Dropbox");
  }

  const sharedLink = await getOrCreateSharedLink(accessToken, uploadedFile.path_display);

  return {
    path: uploadedFile.path_display,
    url: sharedLink,
    name: uploadedFile.name,
  };
}

export async function deleteDropboxFileBySharedUrl(sharedUrl) {
  if (!isDropboxUrl(sharedUrl)) {
    return { deleted: false, skipped: true, reason: "not-dropbox-url" };
  }

  const accessToken = await getDropboxAccessToken();
  const normalizedUrl = normalizeSharedLinkForApi(sharedUrl);

  const metadataResponse = await fetch(DROPBOX_GET_SHARED_LINK_METADATA_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: normalizedUrl }),
  });

  const metadata = await metadataResponse.json();

  if (!metadataResponse.ok) {
    const tag = metadata?.error?.[".tag"];
    if (tag === "shared_link_not_found") {
      return { deleted: false, skipped: true, reason: "shared-link-not-found" };
    }

    throw new Error(
      metadata?.error_summary || "No se pudo obtener metadata del enlace compartido de Dropbox"
    );
  }

  const path = metadata?.path_lower || metadata?.path_display;
  if (!path) {
    return { deleted: false, skipped: true, reason: "missing-path" };
  }

  const deleteResponse = await fetch(DROPBOX_DELETE_FILE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path }),
  });

  const deleteResult = await deleteResponse.json();

  if (!deleteResponse.ok) {
    const notFoundTag = deleteResult?.error?.path_lookup?.[".tag"];
    if (notFoundTag === "not_found") {
      return { deleted: false, skipped: true, reason: "file-not-found" };
    }

    throw new Error(deleteResult?.error_summary || "No se pudo borrar archivo de Dropbox");
  }

  return { deleted: true, path };
}

async function getOrCreateSharedLink(accessToken, path) {
  const listResponse = await fetch(DROPBOX_LIST_SHARED_LINKS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      path,
      direct_only: true,
    }),
  });

  const listData = await listResponse.json();

  if (listResponse.ok && listData.links?.length > 0) {
    return ensureDirectLink(listData.links[0].url);
  }

  const createResponse = await fetch(DROPBOX_CREATE_SHARED_LINK_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      path,
      settings: {
        requested_visibility: "public",
      },
    }),
  });

  const createData = await createResponse.json();

  if (!createResponse.ok) {
    throw new Error(createData?.error?.shared_link_already_exists?.[".tag"] || createData?.error_summary || "No se pudo crear el enlace público de Dropbox");
  }

  return ensureDirectLink(createData.url);
}