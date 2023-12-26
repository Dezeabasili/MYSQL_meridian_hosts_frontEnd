import { useState } from "react"
import axios from "axios"
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors"
import { Link, useLocation, useNavigate } from "react-router-dom"


const UploadMultipleFiles = () => {
    const [filesList, setFilesList] = useState()
    const [progress, setProgress] = useState({ started: false, pc: 0 })
    const [message, setMessage] = useState()
    const axiosWithInterceptors = useAxiosInterceptors()
    // const [uploadType, setUpload] = useState('multiple')
    const location = useLocation()
    const navigate = useNavigate()
    // console.log(location)
    // console.log(location.state)
    const sizeInMB = location?.state?.size
    const FILE_SIZE_LIMIT = sizeInMB * 1024 * 1024 // 5MB
    const allowedExtensions = location?.state?.types
    const fileCode = location?.state?.code
    const id = location?.state?.id


    const handleUpload = async (e) => {
        e.preventDefault()
        // check if user selected at least one file
        if (!filesList.length) {
            setMessage('no file selected')
            return
        }

        // check if any file exceeded the size limit
        let filesAboveSizeLimit = []
        for (let i = 0; i < filesList.length; i++) {
            if (filesList[i].size > FILE_SIZE_LIMIT) {
                filesAboveSizeLimit.push(filesList[i].name)
            }
        }
        if (filesAboveSizeLimit.length) {
            let fileNames = filesAboveSizeLimit.toString()
            setMessage(`${fileNames} is(are) above the ${sizeInMB} MB size limit`)
            return
        }

        // check if the file extension is allowed
        let indexOfExt
        let fileName
        let fileExt
        let FilesNotAllowed = []
        for (let i = 0; i < filesList.length; i++) {
            // get file name
            fileName = filesList[i].name

            // get index of file extension
            indexOfExt = fileName.lastIndexOf('.')

            // get file extension and convert to lower case
            fileExt = (fileName.slice(indexOfExt)).toLowerCase()

            if (!allowedExtensions.includes(fileExt)) {
                FilesNotAllowed.push(filesList[i].name)
            }
        }
        if (FilesNotAllowed.length) {
            let fileNames = FilesNotAllowed.toString()
            setMessage(`${fileNames} is(are) not allowed`)
            return
        }

        const fd = new FormData()

        // check if file is a profile picture. If navigation to this page was from the user's profile page,
        // then there will be only one file in the filesList
        // if (location?.state?.previousPage === '/users/myaccount') {
        if (fileCode === 'profilephoto') {
            fd.append(`customerPreferredProfilePhoto${fileExt}`, filesList[0])
        } 
        else if (fileCode === 'hotelphoto') {
            fd.append(`hotels_${id}${fileExt}`, filesList[0])

        } else if (fileCode === 'roomphoto') {
            for (let i = 0; i < 6; i++) {
                fd.append(`rooms_${id}${i}${fileExt}`, filesList[i])
                // console.log(filesList[i])
            }

        } else {
            for (let i = 0; i < filesList.length; i++) {
                fd.append(filesList[i].name, filesList[i])
                // console.log(filesList[i])
            }

        }

        setMessage('Uploading...')
        setProgress(prev => {
            return { ...prev, started: true }
        })
        try {
            const resp = await axiosWithInterceptors.post('/auth/upload', fd, {
                withCredentials: true,
                onUploadProgress: (ProgressEvent) => { setProgress(prev => { return { ...prev, pc: ProgressEvent.progress * 100 } }) }
            })
            //onUploadProgress: (ProgressEvent) => { console.log(ProgressEvent.progress * 100) } 
            setMessage('Upload successful')
            // console.log(resp.data)
        } catch (err) {
            setMessage('upload failed')
            console.log(err)
        }

    }

    return (
        <div>
            <h3>Upload your files here</h3>
            <form onSubmit={handleUpload}>
                <label>Choose files to upload</label>
                <br />
                {location?.state?.number === 'multiple'
                    ? <input
                        type='file'
                        onChange={(e) => { setFilesList(e.target.files) }}
                        multiple
                        style={{marginTop: '5px'}}
                    /> : <input
                        type='file'
                        onChange={(e) => { setFilesList(e.target.files) }}
                        style={{marginTop: '5px'}}
                    />
                }

                <br />
                <button style={{marginTop: '5px'}}>Upload Files</button>
            </form>
            {progress.started && <progress max={'100'} value={progress.pc} ></progress>}
            {message && <span>{message}</span>}
            <br />
            <span className="uploadFMulSpan" style={{cursor: 'pointer'}} onClick={() => navigate(-1)}>Return to previous page</span>
            
        </div>
    )
}

export default UploadMultipleFiles