"use client";

import { useState } from "react";

type CmsAddButton = React.PropsWithChildren;

export default function CmsAddButton({ children }: CmsAddButton) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button className="bg-blue-500" onClick={() => setOpen(x => !x)}>Add components</button>
            {open && children}
        </>
    );
}
