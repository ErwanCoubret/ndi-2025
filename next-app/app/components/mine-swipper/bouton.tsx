import React, { MouseEventHandler } from 'react';

const Bouton = ({ content, className = "", onClick }: { content: string, className?: string, onClick?: MouseEventHandler<HTMLButtonElement> }) => {

    return (
    <button 
        className={`
            relative overflow-hidden
            px-6 py-3 
            text-lg font-semibold
            bg-slate-700/80 
            text-white
            rounded-xl
            border border-cyan-500/30
            shadow-lg shadow-cyan-500/10
            hover:shadow-cyan-400/30
            hover:border-cyan-400/50
            hover:bg-slate-600/80
            active:scale-95
            transition-all duration-300
            group
            ${className}
        `} 
        onClick={onClick}
    >
        {/* Effet de brillance au hover */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        {/* Contenu du bouton */}
        <span className="relative z-10 flex items-center justify-center gap-2">
            {content}
        </span>
    </button>
    )
}

export default Bouton 