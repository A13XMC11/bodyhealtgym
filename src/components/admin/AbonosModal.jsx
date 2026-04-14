import { useEffect, useState } from 'react'
import { X, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'
import { mesHoy, parseFechaLocal } from '../../lib/dates'
import {
  getCuotaActivaPorMes,
  crearCuota,
  registrarAbono,
  fetchAbonosDeCuota,
} from '../../lib/cuotas'

const MONTO_MENSUAL = 25

export default function AbonosModal({ client, onClose, onAbonoRegistrado }) {
  const [cuota, setCuota] = useState(null)
  const [abonos, setAbonos] = useState([])
  const [monto, setMonto] = useState('')
  const [montoPersonalizado, setMontoPersonalizado] = useState(MONTO_MENSUAL)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pagada, setPagada] = useState(false)
  const [creandoCuota, setCreandoCuota] = useState(false)

  const mes = mesHoy()

  useEffect(() => {
    cargarCuota()
  }, [client.id])

  const cargarCuota = async () => {
    setLoading(true)
    try {
      const cuotaActiva = await getCuotaActivaPorMes(client.id, mes)
      if (cuotaActiva) {
        setCuota(cuotaActiva)
        const abonosData = await fetchAbonosDeCuota(cuotaActiva.id)
        setAbonos(abonosData)
      }
    } catch (err) {
      toast.error('Error al cargar cuota')
    }
    setLoading(false)
  }

  const handleCrearCuota = async () => {
    setCreandoCuota(true)
    try {
      const nuevaCuota = await crearCuota(client.id, mes, montoPersonalizado)
      setCuota(nuevaCuota)
      setAbonos([])
    } catch (err) {
      toast.error(err.message || 'Error al crear cuota')
    }
    setCreandoCuota(false)
  }

  const handleRegistrarAbono = async () => {
    const montoNum = Number(monto)
    if (!montoNum || montoNum <= 0) {
      toast.error('Ingresa un monto válido')
      return
    }

    setSaving(true)
    try {
      const { cuota: cuotaActualizada, membresia } = await registrarAbono(
        cuota.id,
        montoNum,
        client.id,
      )

      setCuota(cuotaActualizada)
      setMonto('')

      const abonosActualizados = await fetchAbonosDeCuota(cuota.id)
      setAbonos(abonosActualizados)

      if (cuotaActualizada.estado === 'pagada' || membresia) {
        setPagada(true)
        toast.success('Mensualidad completada — membresía extendida')
        onAbonoRegistrado(cuotaActualizada)
      } else {
        toast.success(`Abono de $${montoNum.toFixed(2)} registrado`)
        onAbonoRegistrado(cuotaActualizada)
      }
    } catch (err) {
      toast.error(err.message || 'Error al registrar abono')
    }
    setSaving(false)
  }

  const nombreMes = mes
    ? format(new Date(mes + '-01'), 'MMMM yyyy', { locale: es })
    : ''

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gym-dark border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h3 className="text-white font-black text-lg">Abonos</h3>
            <p className="text-gym-gray text-sm">{client.nombre} {client.apellido}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gym-gray hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-gym-red border-t-transparent rounded-full animate-spin" />
            </div>
          ) : pagada ? (
            /* Estado: cuota completada */
            <div className="text-center py-6 space-y-3">
              <CheckCircle className="w-14 h-14 text-green-400 mx-auto" />
              <p className="text-white font-bold text-lg">Mensualidad completada</p>
              <p className="text-gym-gray text-sm">La membresía fue extendida 30 días</p>
              <button
                onClick={onClose}
                className="mt-2 bg-gym-red hover:bg-gym-red-hover text-white font-bold px-6 py-2 rounded-xl btn-interactive"
              >
                Cerrar
              </button>
            </div>
          ) : !cuota ? (
            /* Sin cuota activa — crear una nueva */
            <div className="space-y-4">
              <p className="text-gym-gray text-sm">
                No hay cuota abierta para <span className="text-white capitalize">{nombreMes}</span>.
                Crea una para comenzar a registrar abonos.
              </p>
              <div>
                <label className="block text-gym-gray text-xs font-semibold uppercase mb-1.5">
                  Monto total a cobrar ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={montoPersonalizado}
                  onChange={(e) => setMontoPersonalizado(Number(e.target.value))}
                  className="w-full bg-gym-black border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gym-red"
                />
              </div>
              <button
                onClick={handleCrearCuota}
                disabled={creandoCuota || !montoPersonalizado}
                className="w-full bg-gym-red hover:bg-gym-red-hover disabled:opacity-50 text-white font-bold py-2.5 rounded-xl btn-interactive text-sm"
              >
                {creandoCuota ? 'Creando...' : `Crear cuota de $${montoPersonalizado}`}
              </button>
            </div>
          ) : (
            /* Cuota activa — mostrar progreso y registrar abono */
            <div className="space-y-5">
              {/* Info de la cuota */}
              <div className="bg-gym-black border border-white/5 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-sm capitalize">{nombreMes}</span>
                  <span className="text-gym-gray text-sm">${cuota.monto_total.toFixed(2)}</span>
                </div>

                {/* Barra de progreso */}
                <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gym-red rounded-full transition-all duration-500"
                    style={{ width: `${cuota.porcentaje}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-400 font-semibold">
                    Pagado: ${cuota.monto_pagado.toFixed(2)}
                  </span>
                  <span className="text-gym-red font-semibold">
                    Pendiente: ${cuota.saldo_pendiente.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Input de abono */}
              <div className="space-y-2">
                <label className="block text-gym-gray text-xs font-semibold uppercase">
                  Registrar abono
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRegistrarAbono()}
                    placeholder={`Máx. $${cuota.saldo_pendiente.toFixed(2)}`}
                    className="flex-1 bg-gym-black border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-gym-red placeholder-gym-gray/50"
                  />
                  <button
                    onClick={handleRegistrarAbono}
                    disabled={saving}
                    className="bg-gym-red hover:bg-gym-red-hover disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-lg btn-interactive text-sm whitespace-nowrap"
                  >
                    {saving ? '...' : 'Registrar'}
                  </button>
                </div>
                {/* Acceso rápido al saldo completo */}
                {cuota.saldo_pendiente > 0 && (
                  <button
                    onClick={() => setMonto(cuota.saldo_pendiente.toFixed(2))}
                    className="text-xs text-gym-gray hover:text-gym-red transition-colors"
                  >
                    Completar saldo pendiente (${cuota.saldo_pendiente.toFixed(2)})
                  </button>
                )}
              </div>

              {/* Historial de abonos */}
              {abonos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-gym-gray text-xs font-semibold uppercase">Abonos anteriores</p>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {abonos.map((a) => (
                      <div key={a.id} className="flex items-center justify-between bg-gym-black border border-white/5 rounded-lg px-3 py-2">
                        <span className="text-gym-gray text-xs">
                          {format(parseFechaLocal(a.fecha_pago), 'dd MMM', { locale: es })}
                        </span>
                        <span className="text-white text-sm font-semibold">${Number(a.monto).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
