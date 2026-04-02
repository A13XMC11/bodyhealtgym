import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { MapPin, Phone, Clock, Mail, Loader } from 'lucide-react'

const info = [
  { icon: MapPin, label: 'Dirección', value: 'Humberto Albornoz' },
  { icon: Phone, label: 'Teléfono', value: '+593983048841' },
  { icon: Mail, label: 'Email', value: 'info@bodyhealthgym.com' },
  { icon: Clock, label: 'Horario', value: 'Lun - Vie: 5am–9pm | Sáb: 6am–12pm' },
]

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateNombre = (nombre) => {
  if (!nombre || nombre.trim().length < 3) return false
  return true
}

const validateMensaje = (mensaje) => {
  if (!mensaje || mensaje.trim().length < 10) return false
  return true
}

export default function Contacto() {
  const [sending, setSending] = useState(false)
  const [lastSentTime, setLastSentTime] = useState(null)
  const COOLDOWN_MS = 60_000 // 1 minuto entre envíos
  const isDev = import.meta.env.DEV

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    mode: 'onChange',
  })

  const onSubmit = async (formData) => {
    // Validar rate limiting
    if (lastSentTime && Date.now() - lastSentTime < COOLDOWN_MS) {
      const secsLeft = Math.ceil((COOLDOWN_MS - (Date.now() - lastSentTime)) / 1000)
      toast.error(`Espera ${secsLeft} segundos antes de enviar otro mensaje`)
      return
    }

    // Validar longitud máxima antes del insert
    const nombre = formData.nombre.trim()
    const email = formData.email.trim()
    const mensaje = formData.mensaje.trim()

    if (nombre.length > 100) {
      toast.error('El nombre es demasiado largo (máx. 100 caracteres)')
      return
    }
    if (email.length > 255) {
      toast.error('El email es demasiado largo')
      return
    }
    if (mensaje.length > 2000) {
      toast.error('El mensaje es demasiado largo (máx. 2000 caracteres)')
      return
    }

    setSending(true)
    try {
      const { error } = await supabase.from('contact_messages').insert({
        nombre: nombre.slice(0, 100),
        email: email.slice(0, 255),
        mensaje: mensaje.slice(0, 2000),
      })

      if (error) throw error

      setLastSentTime(Date.now())
      toast.success('✅ Mensaje enviado correctamente')
      reset()
    } catch (err) {
      if (isDev) {
        console.error('[DEV ONLY]', err)
      }
      toast.error('❌ Error al enviar, intenta de nuevo')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contacto" className="py-24 px-4 bg-gym-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-gym-red text-sm font-bold tracking-widest uppercase">Estamos aquí</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mt-3">
            CONT<span className="text-gym-red">ACTO</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {info.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gym-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-gym-red" />
                </div>
                <div>
                  <div className="text-gym-gray text-xs font-semibold uppercase tracking-wider">{item.label}</div>
                  <div className="text-white font-medium mt-1">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gym-black border border-white/5 rounded-2xl p-8">
            <h3 className="text-white font-bold text-xl mb-6">Envíanos un mensaje</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Nombre */}
              <div>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  maxLength="100"
                  {...register('nombre', {
                    required: 'El nombre es requerido',
                    validate: {
                      minLength: (v) => (v.trim().length >= 3) || 'Mínimo 3 caracteres',
                      maxLength: (v) => (v.trim().length <= 100) || 'Máximo 100 caracteres',
                      noOnlySpaces: (v) => (v.trim().length > 0) || 'El nombre no puede estar vacío',
                    },
                  })}
                  className={`w-full bg-gym-dark border rounded-lg px-4 py-3 text-white placeholder-gym-gray focus:outline-none transition-colors ${
                    errors.nombre ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-gym-red'
                  }`}
                />
                {errors.nombre && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.nombre.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="Tu correo"
                  maxLength="255"
                  {...register('email', {
                    required: 'El email es requerido',
                    validate: {
                      validEmail: (v) => validateEmail(v.trim()) || 'Email inválido (debe incluir @ y dominio)',
                      noSpaces: (v) => !v.includes(' ') || 'El email no puede contener espacios',
                      maxLength: (v) => (v.length <= 255) || 'Email demasiado largo',
                    },
                  })}
                  className={`w-full bg-gym-dark border rounded-lg px-4 py-3 text-white placeholder-gym-gray focus:outline-none transition-colors ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-gym-red'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Mensaje */}
              <div>
                <textarea
                  rows={4}
                  placeholder="Tu mensaje..."
                  maxLength="2000"
                  {...register('mensaje', {
                    required: 'El mensaje es requerido',
                    validate: {
                      minLength: (v) => (v.trim().length >= 10) || 'Mínimo 10 caracteres',
                      maxLength: (v) => (v.trim().length <= 2000) || 'Máximo 2000 caracteres',
                      noOnlySpaces: (v) => (v.trim().length > 0) || 'El mensaje no puede estar vacío',
                    },
                  })}
                  className={`w-full bg-gym-dark border rounded-lg px-4 py-3 text-white placeholder-gym-gray focus:outline-none transition-colors resize-none ${
                    errors.mensaje ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-gym-red'
                  }`}
                />
                {errors.mensaje && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.mensaje.message}</p>
                )}
              </div>

              {/* Botón Enviar */}
              <button
                type="submit"
                disabled={sending || Object.keys(errors).length > 0}
                className="w-full bg-gym-red hover:bg-gym-red-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg btn-interactive flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar mensaje'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
