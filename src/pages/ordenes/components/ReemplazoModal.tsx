import React, { useState } from 'react';

// Interfaces y datos de ejemplo para los productos
interface Producto {
  id: number;
  nombre: string;
  precio: number;
}
const reemplazoSimpleData: Producto[] = [
  { id: 101, nombre: "Mouse Inalámbrico", precio: 40.00 },
  { id: 102, nombre: "Mouse Óptico Básico", precio: 25.00 },
  { id: 103, nombre: "Funda para Mouse", precio: 25.00 },
  { id: 104, nombre: "Alfombrilla de Mouse", precio: 25.00 },
];
const reemplazoAgregadoData: Producto[] = [
  { id: 201, nombre: "Mouse Gamer RGB", precio: 40.00 },
  { id: 202, nombre: "Mouse Ergonómico Pro", precio: 58.00 },
  { id: 203, nombre: "Mouse Inalámbrico 2.4G", precio: 70.00 },
];

interface ReemplazoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (itemsSeleccionados: number[]) => void;
}

const ReemplazoModal: React.FC<ReemplazoModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [itemsSeleccionados, setItemsSeleccionados] = useState<number[]>([]);

  if (!isOpen) return null;

  const handleSelect = (id: number) => {
    setItemsSeleccionados(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const ProductTable = ({ title, data }: { title: string; data: Producto[] }) => (
    <div className="w-1/2">
      <h3 className="text-lg font-semibold text-center mb-2">{title}</h3>
      <table className="w-full text-sm border-collapse">
        <thead style={{ backgroundColor: '#C9B35E' }}>
          <tr>
            <th className="p-2 text-left">ID ITEM</th>
            <th className="p-2 text-left">NOMBRE</th>
            <th className="p-2 text-left">PRECIO</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr 
              key={item.id} 
              onClick={() => handleSelect(item.id)}
              className={`border-b cursor-pointer ${itemsSeleccionados.includes(item.id) ? 'bg-yellow-100' : ''}`}
            >
              <td className="p-2">{item.id}</td>
              <td className="p-2">{item.nombre}</td>
              <td className="p-2">{item.precio.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-4xl mx-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center mb-6">Lista de reemplazos</h2>
        <div className="flex gap-8">
          <ProductTable title="Reemplazo simple" data={reemplazoSimpleData} />
          <ProductTable title="Reemplazo agregado" data={reemplazoAgregadoData} />
        </div>
        <div className="flex justify-center">
          <button onClick={() => onSubmit(itemsSeleccionados)} className="mt-8 py-3 px-16 text-white font-bold rounded-md" style={{ backgroundColor: '#C9B35E' }}>
            Realizar reemplazo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReemplazoModal;