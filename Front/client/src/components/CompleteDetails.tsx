import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Label, TextInput, FileInput, ToggleSwitch, Card, Alert } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface Props {
  data?: {
    companyEmail?: string;
  };
}

const CompleteDetails: React.FC<Props> = ({ data }) => {
  const [whitelabel, setWhitelabel] = useState<boolean>(false);
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [publishError, setPublishError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Agency information saved');
    navigate('/agency-dashboard');
  };

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(Number(progress.toFixed(0)));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData((prevData) => ({ ...prevData, image: downloadURL }));
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4">Complete Details</h1>
      <Card className="max-w-3xl w-full p-6 rounded-lg shadow-lg">
        <p className="text-gray-400 mb-6">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores culpa reprehenderit error explicabo voluptatum, tempore odio similique omnis deserunt? Consectetur libero cum delectus nisi accusantium omnis quibusdam autem suscipit quidem?
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
            <FileInput
              type='file'
              accept='image/*'
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
            <Button
              type='button'
              gradientDuoTone='purpleToBlue'
              size='sm'
              outline
              onClick={handleUploadImage}
              disabled={imageUploadProgress !== null}
            >
              {imageUploadProgress !== null ? (
                <div className='w-16 h-16'>
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}%`}
                  />
                </div>
              ) : (
                'Upload Image'
              )}
            </Button>
          </div>
          {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
          {formData.image && (
            <img
              src={formData.image}
              alt='upload'
              className='w-full h-72 object-cover'
            />
          )}
          <div>
            <Label htmlFor="agencyName" value=" Name" />
            <TextInput id="agencyName" placeholder="Your agency name" required />
          </div>
          <div>
            <Label htmlFor="agencyEmail" value=" Email" />
            <TextInput id="agencyEmail" type="email" value={data?.companyEmail || ''} disabled />
          </div>
          <div>
            <Label htmlFor="phoneNumber" value=" Phone Number" />
            <TextInput id="phoneNumber" type="tel" placeholder="Phone" required />
          </div>
          <div>
            <ToggleSwitch checked={whitelabel} onChange={setWhitelabel} label="" />
          </div>
          <ReactQuill
            theme='snow'
            placeholder='Write something...'
            className='h-72 !mb-16'
            required
            onChange={(value) => setFormData((prevData) => ({ ...prevData, content: value }))}
          />
          <Button type="submit" gradientDuoTone='purpleToPink' className="w-full mt-4">Save The Accont Information</Button>
          {publishError && (
            <Alert className='mt-5' color='failure'>
              {publishError}
            </Alert>
          )}
        </form>
      </Card>
    </div>
  );
};

export default CompleteDetails;
