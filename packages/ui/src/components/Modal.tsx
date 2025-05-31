import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='fixed inset-0 bg-black bg-opacity-50'
        onClick={onClose}
      />
      <div className='relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md'>
        {title && <h2 className='text-xl font-semibold mb-4'>{title}</h2>}
        {children}
      </div>
    </div>
  );
};
