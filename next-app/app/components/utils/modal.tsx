import { useEffect, ReactNode } from 'react';
import { IoClose } from 'react-icons/io5';

interface ModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  children?: ReactNode;
  showCloseButton?: boolean;
}

const Modal = ({ showModal, setShowModal, title, children, showCloseButton = false }: ModalProps) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [setShowModal]);

  // Bloquer le scroll du body quand la modal est ouverte
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  return (
    <>
      {showModal ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6">
          {/* Backdrop avec blur */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setShowModal(false)}
          />
          
          {/* Container de la modal */}
          <div className="relative z-10 w-full max-w-lg animate-modal-in mx-2">
            {/* Contenu de la modal */}
            <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-purple-100 overflow-hidden max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 shrink-0">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-purple-400 flex items-center gap-2">
                  {title}
                </h2>
                <button
                  className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-slate-100 transition-all duration-200 shrink-0"
                  onClick={() => setShowModal(false)}
                >
                  <IoClose className="text-xl sm:text-2xl" />
                </button>
              </div>
              
              {/* Body - scrollable si nécessaire */}
              <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1">
                {children}
              </div>
              
              {/* Footer avec bouton fermer */}
              {showCloseButton && (
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border-t border-slate-100 shrink-0">
                  <button
                    className="w-full py-2 sm:py-2.5 rounded-full bg-white hover:bg-purple-400 text-purple-400 hover:text-white font-medium border border-purple-200 hover:border-purple-400 transition-all duration-300 text-sm sm:text-base"
                    onClick={() => setShowModal(false)}
                  >
                    Compris ! 👍
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
      
      {/* Animation CSS */}
      <style jsx>{`
        @keyframes modal-in {
          0% {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-in {
          animation: modal-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Modal;
