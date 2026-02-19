import { useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Button } from '../components/ui/Button'
import { AuthLayout } from '../components/AuthLayout'
import { SocialButtons } from '../components/SocialButtons'

export default function Login() {
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()
        navigate('/')
    }

    const handleSocialLogin = (provider) => {
        console.log(`Login con ${provider}`)
        navigate('/')
    }

    return (
        <AuthLayout
            title="Bienvenido a MultiMeet"
            subtitle="Conecta con tu comunidad local"
        >
            <h2 className="text-xl font-semibold mb-8">Inicia sesión para continuar</h2>

            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <Label htmlFor="email" className="mb-2 block">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        className="h-12 rounded-xl"
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="password" className="mb-2 block">Contraseña</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="h-12 rounded-xl"
                        required
                    />
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl mt-8">
                    Iniciar Sesión
                </Button>
            </form>

            <SocialButtons onSocialLogin={handleSocialLogin} />

            <p className="text-center text-sm text-muted-foreground mt-8">
                ¿No tienes cuenta?{' '}
                <button
                    onClick={() => navigate('/signup')}
                    className="text-primary font-semibold hover:underline"
                >
                    Regístrate
                </button>
            </p>
        </AuthLayout>
    )
}
