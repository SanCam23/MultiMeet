import logoPng from '../assets/logo.png'

export function AuthLayout({ title, subtitle, children }) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6 py-8">
            <div className="w-full max-w-md">
                {/* Logo y título */}
                <div className="text-center mb-12">
                    <img
                        src={logoPng}
                        alt="MultiMeet Logo"
                        className="w-20 h-20 mx-auto mb-6"
                    />
                    <h1 className="text-3xl font-bold text-foreground mb-3">{title}</h1>
                    <p className="text-muted-foreground">{subtitle}</p>
                </div>

                <div className="bg-card rounded-3xl shadow-xl p-8 md:p-10 border border-border">
                    {children}
                </div>
            </div>
        </div>
    )
}
