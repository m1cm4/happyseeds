export function SimpleLoadingText({ text }: { text: string }) {
   return (
      <div className="flex justify-center py-8">
         <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-muted animate-pulse"></div>
            <p className="text-wire-text-muted">{text}</p>
         </div>
      </div>
   );
}
