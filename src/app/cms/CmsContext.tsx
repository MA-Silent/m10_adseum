"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { executeActions, type CmsAction } from "@/src/lib/serverFunctions";

type CmsContextType = {
  addAction: (action: CmsAction) => void;
};

const CmsContext = createContext<CmsContextType | null>(null);

export function CmsProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<CmsAction[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(()=>{
    actions.forEach((action)=>{
      if(action.type === "move"){
        const domComponent = document.getElementById(`component:${action.component.id}`)!;

        domComponent.style.order = `${parseInt(domComponent.style.order) + action.amount}`
      }
      if(action.type === "remove") {
        const domComponent = document.getElementById(`component:${action.component.id}`)!;

        domComponent.style.display = 'none';
      }
    })
  },[actions])

  const addAction = (action: CmsAction) => {
    setActions((prev) => [...prev, action]);
  };

  async function handleSave() {
    setSaving(true);

    if( await executeActions(actions) ){
      setActions([]);
      setSaving(false);
    } else {
      setSaving(false);
      setError("Could not save Actions!");
    }

  }

  return (
    <CmsContext.Provider value={{ addAction }}>
      {children}

      {actions.length > 0 && (
        <button
          className="fixed top-2 left-1/2 p-2 bg-sky-400 rounded z-50 shadow-lg text-white font-bold"
          onClick={handleSave}
          disabled={ saving }
        >
          {saving || error ? (error ? `error: ${error}` : "Saving...") : `Save ${actions.length} Changes` }
        </button>
      )}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const context = useContext(CmsContext);
  if (!context) throw new Error("useCms must be used within a CmsProvider");
  return context;
}
