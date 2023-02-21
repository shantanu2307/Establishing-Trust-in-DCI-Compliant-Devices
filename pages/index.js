import axios from "axios"
import { useEffect, useRef, useState } from "react"

export default function Home() {

  useEffect(() => {
    async function getCertificates() {
      const url = "http://127.0.0.1:5000/device_manufacturer/get_certificates"
      const headers = {
        'Content-Type': 'application/json'
      }
      const res = await axios.get(url, { headers: headers, withCredentials: true });
      console.log(res.data)
    }
    getCertificates()
  }, [])


  const fileRef = useRef()
  const [file, setFile] = useState()
  const [filename, setFilename] = useState("")
  async function handleSubmit(e) {
    e.preventDefault()
    console.log(file, filename)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("filename", filename);
    const headers = {
      'Content-Type': 'multipart/form-data'
    }
    const url = "http://127.0.0.1:5000/distribution_house/add_certificate"
    try {
      const response = await axios.post(url, formData, {
        headers: headers
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }

  }

  function handleChange(e) {
    const file = e.target.files[0]
    setFile(file)
    setFilename(file.name)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" ref={fileRef} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  )
}