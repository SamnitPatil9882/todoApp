import { useEffect, useState } from "react"

const useFetch = <T>(url: string) => {
   const [data, setData] = useState<T>()
   const [ispending, setPending] = useState(true)
   const [error, setError] = useState("")
   useEffect(() => {
      const abortCont = new AbortController();
      fetchData();
      return () => abortCont.abort()
   }, [])

   const fetchData = ()=>{
      fetch(url)
      .then(res => res.json())
      .then(res => {
         setData(res);
         setPending(false)
         setError("")
      })
      .catch(error => {
         setError(error.message)
         setPending(false)
      })
   }
   return { data, ispending, error, refetch: fetchData ,setData,setError} as const
   // return [data,setData]!
   // return data
}

export default useFetch;