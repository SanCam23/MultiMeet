import { useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { Button } from '../components/ui/Button'
import { AuthLayout } from '../components/AuthLayout'
import { SocialButtons } from '../components/SocialButtons'

export default function Signup() {
    const navigate = useNavigate()

    const handleSignup = (e) => {
        e.preventDefault()
        navigate('/')
    }

    const handleSocialSignup = (provider) => {
        console.log(`Registro con ${provider}`)
        navigate('/')
    }

    return (
        <AuthLayout
            title="Únete a MultiMeet"
            subtitle="Empieza a conectar con tu comunidad"
        >
            <h2 className="text-xl font-semibold mb-8">Crea tu cuenta</h2>

            <form onSubmit={handleSignup} className="space-y-6">
                <div>
                    <Label htmlFor="name" className="mb-2 block">Nombre Completo</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Juan Pérez"
                        className="h-12 rounded-xl"
                        required
                    />
                </div>

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
                    Crear Cuenta
                </Button>
            </form>

            <SocialButtons onSocialLogin={handleSocialSignup} />

            <p className="text-center text-sm text-muted-foreground mt-8">
                ¿Ya tienes cuenta?{' '}
                <button
                    onClick={() => navigate('/login')}
                    className="text-primary font-semibold hover:underline"
                >
                    Inicia sesión
                </button>
            </p>
        </AuthLayout>
    )
}
