export const mockEvents = {
  following: [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1760642626994-8ebd037f78dc?w=1080",
      title: "Tech Networking Night",
      date: "Feb 15, 2026",
      time: "7:00 PM",
      location: "Downtown Tech Hub, San Francisco",
      participants: 45,
      category: "Tech",
      isTrending: true,
      description: "Únete a un grupo de mentes curiosas para hablar de nuevas tecnologías, desarrollo y crear conexiones de alto valor.",
      author: { name: "Carlos Ruiz", initials: "CR", avatarColor: "#7209B7" },
      userGallery: [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600",
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600"
      ]
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1759074037385-0ad31887b14f?w=1080",
      title: "Coffee & Conversation Morning",
      date: "Feb 14, 2026",
      time: "9:00 AM",
      location: "Blue Bottle Coffee, Oakland",
      participants: 12,
      category: "Social",
      description: "Una mañana tranquila para tomar café, conocer a profesionales locales de diseño y hablar sobre proyectos frescos.",
      author: { name: "Ana Martínez", initials: "AM", avatarColor: "#9263F8" },
      userGallery: [
        "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600",
        "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600"
      ]
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1644612105654-b6b0a941ecde?w=1080",
      title: "Sunrise Yoga Session",
      date: "Feb 16, 2026",
      time: "6:30 AM",
      location: "Golden Gate Park",
      participants: 28,
      category: "Fitness",
      description: "Empieza tu día con energía vital con esta sesión guiada de Yoga al amanecer apta para todos los niveles.",
      author: { name: "Clara Vega", initials: "CV", avatarColor: "#7CCFEB" },
      userGallery: [
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
        "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600"
      ]
    },
  ],
  topInCity: [
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1672841821756-fc04525771c2?w=1080",
      title: "Indie Music Festival",
      date: "Feb 20, 2026",
      time: "5:00 PM",
      location: "The Fillmore, San Francisco",
      participants: 156,
      category: "Music",
      isTrending: true,
      description: "Conciertos de las mejores bandas locales de indie rock y alternativo. Food trucks y bebida artesanal en el lugar.",
      author: { name: "Indie SF", initials: "SF", avatarColor: "#7209B7" },
      userGallery: [
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600",
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600"
      ]
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1770564512491-e88eb93d48a3?w=1080",
      title: "Weekend Hiking Adventure",
      date: "Feb 18, 2026",
      time: "8:00 AM",
      location: "Mount Tamalpais Trailhead",
      participants: 34,
      category: "Outdoor",
      isTrending: true,
      description: "Ruta de senderismo de dificultad moderada hasta la cumbre. Vistas fantásticas del amanecer.",
      author: { name: "Alex Trekker", initials: "AT", avatarColor: "#dc2626" },
      userGallery: [
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600"
      ]
    },
    {
      id: "6",
      image: "https://images.unsplash.com/photo-1762994576926-b8268190a2c9?w=1080",
      title: "Italian Cooking Workshop",
      date: "Feb 17, 2026",
      time: "6:00 PM",
      location: "Culinary Institute, Berkeley",
      participants: 20,
      category: "Food",
      description: "Aprenda a hacer pasta fresca a mano con los mejores ingredientes locales guiado por chefs del instituto.",
      author: { name: "Chef Guido", initials: "CG", avatarColor: "#9263F8" },
      userGallery: [
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600",
        "https://images.unsplash.com/photo-1621376281734-78330ad3d7e5?w=600"
      ]
    },
  ],
  topGlobal: [
    {
      id: "global-1",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
      title: "Coachella Valley Music Festival 2026",
      date: "Apr 10-12, 2026",
      time: "12:00 PM",
      location: "Indio, California",
      participants: 125000,
      category: "Music",
      isTrending: true,
      description: "El icónico festival de música del Valle de Coachella. Únase a decenas de miles de personas para disfrutar de espectáculos artísticos impresionantes y buena música.",
      author: { name: "Goldenvoice", initials: "GV", avatarColor: "#eab308" },
      userGallery: ["https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600"],
      previousEditions: [
        {
          id: "coachella-2025",
          year: "2025",
          image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600",
          title: "Coachella Valley Music Festival 2025",
          date: "Apr 11-13, 2025",
          participants: 120000,
        },
        {
          id: "coachella-2024",
          year: "2024",
          image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600",
          title: "Coachella Valley Music Festival 2024",
          date: "Apr 12-14, 2024",
          participants: 115000,
        },
        {
          id: "coachella-2023",
          year: "2023",
          image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600",
          title: "Coachella Valley Music Festival 2023",
          date: "Apr 14-16, 2023",
          participants: 110000,
        },
      ],
    },
    {
      id: "global-2",
      image: "https://images.unsplash.com/photo-1566443280617-35db331c54fb?w=800",
      title: "Formula 1 Monaco Grand Prix",
      date: "May 23-25, 2026",
      time: "2:00 PM",
      location: "Monte Carlo, Monaco",
      participants: 200000,
      category: "Motorsport",
      isTrending: true,
      description: "Siente la velocidad a pie de pista en este circuito legendario al borde del mar.",
      author: { name: "FIA Formula 1", initials: "F1", avatarColor: "#dc2626" },
      userGallery: ["https://images.unsplash.com/photo-1566443280617-35db331c54fb?w=600"],
      previousEditions: [
        {
          id: "monaco-2025",
          year: "2025",
          image: "https://images.unsplash.com/photo-1612852098516-55d01c75769a?w=600",
          title: "Formula 1 Monaco Grand Prix 2025",
          date: "May 24-26, 2025",
          participants: 195000,
        },
        {
          id: "monaco-2024",
          year: "2024",
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
          title: "Formula 1 Monaco Grand Prix 2024",
          date: "May 25-27, 2024",
          participants: 190000,
        },
      ],
    },
    {
      id: "global-3",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
      title: "Tomorrowland Festival 2026",
      date: "Jul 17-19, 2026",
      time: "3:00 PM",
      location: "Boom, Belgium",
      participants: 400000,
      category: "Music",
      isTrending: true,
      description: "El festival más grande mundial de música electrónica.",
      author: { name: "Tomorrowland", initials: "TL", avatarColor: "#7209B7" },
      userGallery: ["https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600"],
      previousEditions: [
        {
          id: "tomorrowland-2025",
          year: "2025",
          image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600",
          title: "Tomorrowland Festival 2025",
          date: "Jul 18-20, 2025",
          participants: 390000,
        },
        {
          id: "tomorrowland-2024",
          year: "2024",
          image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600",
          title: "Tomorrowland Festival 2024",
          date: "Jul 19-21, 2024",
          participants: 380000,
        },
        {
          id: "tomorrowland-2023",
          year: "2023",
          image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600",
          title: "Tomorrowland Festival 2023",
          date: "Jul 21-23, 2023",
          participants: 370000,
        },
      ],
    },
    {
      id: "global-4",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
      title: "Glastonbury Festival",
      date: "Jun 24-28, 2026",
      time: "11:00 AM",
      location: "Pilton, Somerset, UK",
      participants: 210000,
      category: "Music",
      description: "Festival de cinco días con actuaciones destacadas y actividades de arte diverso en Reino Unido.",
      author: { name: "Glastonbury", initials: "GF", avatarColor: "#16a34a" },
      userGallery: ["https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600"],
      previousEditions: [
        { id: "glastonbury-2025", year: "2025", image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600", title: "Glastonbury Festival 2025", date: "Jun 25-29, 2025", participants: 205000 },
        { id: "glastonbury-2024", year: "2024", image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600", title: "Glastonbury Festival 2024", date: "Jun 26-30, 2024", participants: 200000 },
        { id: "glastonbury-2023", year: "2023", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600", title: "Glastonbury Festival 2023", date: "Jun 21-25, 2023", participants: 195000 },
      ],
    },
    {
      id: "global-5",
      image: "https://images.unsplash.com/photo-1612852098516-55d01c75769a?w=800",
      title: "24 Hours of Le Mans",
      date: "Jun 13-14, 2026",
      time: "4:00 PM",
      location: "Le Mans, France",
      participants: 250000,
      category: "Motorsport",
      description: "El histórico torneo de resistencia extrema. Vehículos de carreras operando las 24 horas del día.",
      author: { name: "Le Mans Official", initials: "LM", avatarColor: "#dc2626" },
      userGallery: []
    },
    {
      id: "global-6",
      image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
      title: "Ultra Music Festival Miami",
      date: "Mar 27-29, 2026",
      time: "1:00 PM",
      location: "Miami, Florida",
      participants: 165000,
      category: "Music",
      description: "Las superestrellas mundiales del EDM en el icónico Bayfront Park.",
      author: { name: "UMF", initials: "UF", avatarColor: "#7CCFEB" },
      userGallery: []
    },
  ],
};

export const getEventById = (id) => {
  const allEvents = [
    ...mockEvents.following,
    ...mockEvents.topInCity,
    ...mockEvents.topGlobal
  ];
  return allEvents.find((evt) => evt.id === id);
};
