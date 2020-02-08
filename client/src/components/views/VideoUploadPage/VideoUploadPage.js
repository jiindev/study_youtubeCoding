import React from 'react'
import {Typography, Button, Form, message, Input, Icon} from 'antd';
import Dropzone from 'react-dropzone';
const {Title} = Typography;
const {TextArea} = Input;

const VideoUploadPage = () => {
    return (
        <div style={{maxWidth:'700px', margin:'2rem auto'}}>
            
            <div style={{textAlign:"center", marginBottom:'2rem'}}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit>
                <div style={{display:'flex', justifyContent:"space-between"}}>
                    <Dropzone
                    onDrop
                    multiple
                    maxSize>
                        {({getRootProps, getInputProps})=>(
                            <div style={{width:'300px', height:'240px', border:'1px solid lightgrey', 
                            alignItems:'center', justifyContent:'center', textAlign:'center'}} {...getRootProps()}>
                                <input {...getInputProps()}/>
                                <Icon type="plus" style={{fontSize:'3rem'}}/>
                            </div>
                        )}
                    </Dropzone>
                    {/*thumbnail zone */}
                    <div>
                        <img src="" alt=""/>
                    </div>
                </div>
                <br/>
                <br/>
                <Input
                    onChange
                    value
               />
               <br/>
               <br/>
               <label>Description</label>
               <TextArea
                    onChange
                    value
               />
               <br/>
               <br/>
               <select onChange>
                   <option key value></option>
               </select>
               <br/>
                <br/>
               <select onChange>
                   <option key value></option>
               </select>
               <br/>
                <br/>
               <Button type="primary" size="large" onclick>Submit</Button>
            </Form>
        </div>
    )
}

export default VideoUploadPage
