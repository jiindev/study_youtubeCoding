import React, {useState} from 'react'
import {Typography, Button, Form, message, Input, Icon} from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import {useSelector} from 'react-redux';
// import { response } from 'express';

const {Title} = Typography;
const {TextArea} = Input;


const PrivateOptions = [
    {value:0, label:"Private"},
    {value:1, label:"Public"}
];

const CategoryOptions = [
    {value:0, label:"Film & Animation"},
    {value:1, label:"Audios & Vehicles"},
    {value:2, label:"Music"},
    {value:3, label:"Pets & Animals"},
    {value:4, label:"Sports"},
]

const VideoUploadPage = (props) => {
    const user = useSelector(state=>state.user);
    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0);
    const [Category, setCategory] = useState("Film & Animation");
    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState("");
    const [ThumbnailPath, setThumbnailPath] = useState("");

    const onTtitleChange = (e) =>{
        setVideoTitle(e.currentTarget.value);
    }
    const onDescriptionChange = (e) =>{
        setDescription(e.currentTarget.value)
    }
    const onCategoryChange = (e) =>{
        setCategory(e.currentTarget.value)
    }
    const onPrivateChange = (e) =>{
        setPrivate(e.currentTarget.value)
    }

    const onSubmit = (e)=>{
        e.preventDefault();
        console.log('클릭');

        const variable = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath,
        }
        Axios.post('/api/video/uploadVideo', variable)
            .then(response=>{
                if(response.data.success){
                    message.success('성공적으로 업로드 했습니다.');
                    setTimeout(()=>{
                        props.history.push('/');
                    },3000);
                }else{
                    alert('비디오 업로드에 실패 했습니다.');
                }
            });
    }

    const onDrop = (files) =>{
        let formData = new FormData;
        const config = {
            header : {'content-type':'multipart/form-data'}
        }
        console.log(files);
        formData.append('file', files[0]);

        Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if(response.data.success){
                    console.log(response.data);
                    let variable = {
                        url:response.data.url,
                        fileName:response.data.fileName
                    }
                    setFilePath(response.data.url);
                    
                    Axios.post('/api/video/thumbnail', variable)
                    .then(response=>{
                        if(response.data.success){
                            console.log(response.data);
                            setDuration(response.data.fileDuration);
                            setThumbnailPath(response.data.url);
                        }else {
                            alert('섬네일 생성에 실패했습니다.');
                        }
                    })
                }else{
                    alert('비디오 업로드를 실패했습니다.');
                }
            })
    }

    return (
        <div style={{maxWidth:'700px', margin:'2rem auto'}}>
            
            <div style={{textAlign:"center", marginBottom:'2rem'}}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{display:'flex', justifyContent:"space-between"}}>
                    <Dropzone
                    onDrop={onDrop}
                    multiple={false}
                    maxSize={100000000}
                    >
                        {({getRootProps, getInputProps})=>(
                            <div style={{width:'300px', height:'240px', border:'1px solid lightgrey', 
                            alignItems:'center', justifyContent:'center', textAlign:'center'}} {...getRootProps()}>
                                <input {...getInputProps()}/>
                                <Icon type="plus" style={{fontSize:'3rem'}}/>
                            </div>
                        )}
                    </Dropzone>
                    {/*thumbnail zone */}
                    {ThumbnailPath &&
                        <div>
                            <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail"/>
                        </div>
                    }
                </div>
                <br/>
                <br/>
                <label>Title</label>
                <Input
                    onChange={onTtitleChange}
                    value={VideoTitle}
               />
               <br/>
               <br/>
               <label>Description</label>
               <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
               />
               <br/>
               <br/>
               <select onChange={onPrivateChange}>
                   {PrivateOptions.map((item, index)=>(
                       <option key={index} value={item.value}>{item.label}</option>
                   ))}
               </select>
               <br/>
                <br/>
               <select onChange={onCategoryChange}>
                   {CategoryOptions.map((item, index)=>(
                       <option key={index} value={item.value}>{item.label}</option>
                   ))}
               </select>
               <br/>
                <br/>
               <Button type="primary" size="large" onClick={onSubmit}>Submit</Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage
