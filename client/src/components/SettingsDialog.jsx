import { Settings, Moon, Sun, Contrast, Type } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/Dialog'
import { Button } from './ui/Button'
import { useTheme } from '../context/ThemeContext'

export function SettingsDialog() {
    const { theme, setTheme, largeText, setLargeText } = useTheme()
    const isHighContrast = theme === 'high-contrast'

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-xl"
                >
                    <Settings className="w-5 h-5 text-primary" />
                </Button>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined} className="sm:max-w-[525px] rounded-3xl p-0 gap-0">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
                    <DialogTitle className="text-2xl font-bold">Ajustes</DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 overscroll-contain px-6 py-5">
                    {/* Theme Section */}
                    <div className="mb-5">
                        <h3 className="font-semibold text-lg mb-1">Apariencia</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                            Elige cómo se ve MultiMeet
                        </p>

                        <div className="grid grid-cols-3 gap-3">
                            {/* Light Mode */}
                            <button
                                onClick={() => setTheme('light')}
                                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${theme === 'light'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border bg-card hover:border-primary/30'
                                    }`}
                            >
                                <div
                                    className={`w-11 h-11 rounded-full flex items-center justify-center ${theme === 'light'
                                        ? `bg-primary ${isHighContrast ? 'text-black' : 'text-white'}`
                                        : `bg-muted ${isHighContrast ? 'text-white' : 'text-muted-foreground'}`
                                        }`}
                                >
                                    <Sun className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-sm">Claro</span>
                                {theme === 'light' && (
                                    <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                                )}
                            </button>

                            {/* Dark Mode */}
                            <button
                                onClick={() => setTheme('dark')}
                                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${theme === 'dark'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border bg-card hover:border-primary/30'
                                    }`}
                            >
                                <div
                                    className={`w-11 h-11 rounded-full flex items-center justify-center ${theme === 'dark'
                                        ? `bg-primary ${isHighContrast ? 'text-black' : 'text-white'}`
                                        : `bg-muted ${isHighContrast ? 'text-white' : 'text-muted-foreground'}`
                                        }`}
                                >
                                    <Moon className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-sm">Oscuro</span>
                                {theme === 'dark' && (
                                    <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                                )}
                            </button>

                            {/* High Contrast Mode */}
                            <button
                                onClick={() => setTheme('high-contrast')}
                                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${theme === 'high-contrast'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border bg-card hover:border-primary/30'
                                    }`}
                            >
                                <div
                                    className={`w-11 h-11 rounded-full flex items-center justify-center ${theme === 'high-contrast'
                                        ? `bg-primary ${isHighContrast ? 'text-black' : 'text-white'}`
                                        : `bg-muted ${isHighContrast ? 'text-black' : 'text-muted-foreground'}`
                                        }`}
                                >
                                    <Contrast className={`w-5 h-5 ${isHighContrast ? 'text-black' : ''}`} />
                                </div>
                                <span className="font-medium text-sm text-center">Alto Contraste</span>
                                {theme === 'high-contrast' && (
                                    <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border mb-5" />

                    {/* Text Size Section */}
                    <div>
                        <h3 className="font-semibold text-lg mb-1">Tamaño de texto</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                            Ajusta el tamaño de texto en toda la app
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Normal */}
                            <button
                                onClick={() => setLargeText(false)}
                                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${!largeText
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border bg-card hover:border-primary/30'
                                    }`}
                            >
                                <div
                                    className={`w-11 h-11 rounded-full flex items-center justify-center ${!largeText
                                        ? `bg-primary ${isHighContrast ? 'text-black' : 'text-white'}`
                                        : `bg-muted ${isHighContrast ? 'text-white' : 'text-muted-foreground'}`
                                        }`}
                                >
                                    <Type className={`w-5 h-5 ${isHighContrast && !largeText ? 'text-black' : ''}`} />
                                </div>
                                <div className="text-center">
                                    <span className="font-medium text-sm block">Normal</span>
                                    <span className="text-xs text-muted-foreground">Base 16px</span>
                                </div>
                                {!largeText && (
                                    <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                                )}
                            </button>

                            {/* Large */}
                            <button
                                onClick={() => setLargeText(true)}
                                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${largeText
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border bg-card hover:border-primary/30'
                                    }`}
                            >
                                <div
                                    className={`w-11 h-11 rounded-full flex items-center justify-center ${largeText
                                        ? `bg-primary ${isHighContrast ? 'text-black' : 'text-white'}`
                                        : `bg-muted ${isHighContrast ? 'text-white' : 'text-muted-foreground'}`
                                        }`}
                                >
                                    <Type className={`w-6 h-6 ${isHighContrast ? (largeText ? 'text-black' : 'text-white') : ''}`} />
                                </div>
                                <div className="text-center">
                                    <span className="font-medium text-sm block">Grande</span>
                                    <span className="text-xs text-muted-foreground">Base 20px</span>
                                </div>
                                {largeText && (
                                    <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
