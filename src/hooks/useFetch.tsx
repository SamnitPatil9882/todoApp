import { useEffect, useState } from "react"
import todoInfo from "../models/todoItem"

const useFetch = (url: string) => {
   const [data, setData] = useState<todoInfo[]>([])
   const [ispending, setPending] = useState(true)
   const [error, setError] = useState("")
   useEffect(() => {
      const abortCont = new AbortController();
      fetch(url)
         .then(res => res.json())
         .then(res => {
            if (Array.isArray(res)) {
               setData(res);
            } else {
               setData([res]);
            }
            setPending(false)
            setError("")
         })
         .catch(error => {
            setError(error.message)
            setPending(false)
         })
      return () => abortCont.abort()
   }, [url])

   return { data, ispending, error } as const
   // return [data,setData]!
   // return data
}

export default useFetch;