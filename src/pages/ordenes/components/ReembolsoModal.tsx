import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ReembolsoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { cci: string; beneficiario: string; monto: number; moneda: string }) => void;
  montoSugerido: number;
}

const ReembolsoModal: React.FC<ReembolsoModalProps> = ({ isOpen, onClose, onSubmit, montoSugerido }) => {
  // Estados internos para manejar los campos del formulario
  const [cci, setCci] = useState('');
  const [beneficiario, setBeneficiario] = useState('Juan Velazco Vega'); // Valor de ejemplo
  const [monto, setMonto] = useState(montoSugerido);
  const [moneda, setMoneda] = useState('Soles');

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Aquí irían las validaciones de los campos
    if (!cci || !monto) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }
    onSubmit({ cci, beneficiario, monto, moneda });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center mb-2">Reembolso a cliente</h2>
        <p className="text-center text-gray-500 mb-6">Ingrese los detalles de la tarjeta</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Código de cuenta interbancaria</label>
            <input type="text" value={cci} onChange={e => setCci(e.target.value)} placeholder="003-123-004567890123-45" className="w-full mt-1 p-2 border rounded-md"/>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Nombre del Beneficiario</label>
            <input type="text" value={beneficiario} onChange={e => setBeneficiario(e.target.value)} className="w-full mt-1 p-2 border rounded-md"/>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-sm font-medium text-gray-700">Monto</label>
              <input type="number" value={monto} onChange={e => setMonto(parseFloat(e.target.value))} className="w-full mt-1 p-2 border rounded-md"/>
            </div>
            <div className="w-1/2">
              <label className="text-sm font-medium text-gray-700">Moneda</label>
              <input type="text" value={moneda} onChange={e => setMoneda(e.target.value)} className="w-full mt-1 p-2 border rounded-md bg-gray-100" readOnly/>
            </div>
          </div>
        </div>
        
        <button onClick={handleSubmit} className="w-full mt-8 py-3 text-white font-bold rounded-md" style={{ backgroundColor: '#C9B35E' }}>
          Proceder
        </button>
      </div>
    </div>
  );
};

export default ReembolsoModal;