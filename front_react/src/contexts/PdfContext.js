import { createContext, useState, useEffect } from 'react';


export const PdfContext  = createContext();


export const PdfContextProvider = ({ children }) => {
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState();
    const [fullText, setFullText] = useState('');
    const [extractive_summary, setExtractiveSummary] = useState('');
    const [abstractive_summary, setAbstractiveSummary] = useState('');
    const [named_entity, setNamedEntity] = useState();
    
    
    return (
        <PdfContext.Provider value={{fileName, setFileName,
                                    file, setFile,
                                    fullText, setFullText,
                                    extractive_summary, setExtractiveSummary,
                                    abstractive_summary, setAbstractiveSummary,
                                    named_entity, setNamedEntity}}>
            {children}
        </PdfContext.Provider>
    )
}