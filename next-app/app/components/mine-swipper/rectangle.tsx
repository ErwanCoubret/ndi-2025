const Rectangle = ({ content, image, className = "" }: { content: string, image? : string, className?: string }) => {

    return (
    <div className={`
        relative overflow-hidden
        px-4 py-3
        bg-slate-700/60
        backdrop-blur-sm
        rounded-xl
        border border-slate-600/50
        shadow-lg shadow-slate-900/30
        flex items-center
        ${className}
    `}>
        {/* Effet de brillance subtile */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        {/* Contenu */}
        <div className="relative z-10 flex items-center gap-3">
            {image && (
                <div className="relative">
                    <img 
                        className="w-8 h-8 object-contain drop-shadow-lg" 
                        src={image} 
                        alt="Icon" 
                    />
                    {/* Petite lueur derrière l'icône */}
                    <div className="absolute inset-0 bg-cyan-400/20 blur-md -z-10" />
                </div>
            )}
            <span className="text-lg font-mono font-semibold text-white tracking-wide">
                {content}
            </span>
        </div>
    </div>
    )
}

export default Rectangle 