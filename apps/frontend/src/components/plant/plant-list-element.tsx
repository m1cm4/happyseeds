import {  Link } from "@tanstack/react-router";
import { Plant } from "@/@types/plant.types";
import { formatCommonWithCultivar, formatLatinName, getNames } from "@/utils/plant.utils";

// destructuration identique à PlantListElement(props: { plant: Plant })
export function PlantListElement({ plant }: { plant: Plant }) {  
   
   const names = getNames(plant);
   
   return (
      <Link
      to="/plant/$id" 
      params={{ id: plant.id }}
      className="block"
      >
         <div className="bg-white p-4 rounded-lg border hover:border-emerald-500  
   transition-colors">
            <div className="flex justify-between items-start">
               <div>
                  <h2 className="font-semibold text-lg text-slate-800">{names[0]}
                     <p className="text-sm text-slate-500 italic">{names[1]}</p>
                  </h2>
               </div>
               <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">{plant.category}</span>
            </div>
         </div>   
      </Link>    
   );     
} 