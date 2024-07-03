import {
  Alert,
  Button,
  FileInput,
  Select,
  TextInput,
  Checkbox,
  Table,
  Dropdown,
} from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [rows, setRows] = useState([{ value: "" }]);
  const [files, setFiles] = useState([]);
  const [uploadType, setUploadType] = useState(1);
  var imageUrls = [];
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();

  const addRow = () => {
    setRows([...rows, { value: "" }]);
  };

  const handleChange = (index, event) => {
    const newRows = rows.map((row, i) => {
      if (i === index) {
        return { ...row, value: event.target.value };
      }
      return row;
    });
    setRows(newRows);
    setFormData({ ...formData, image: newRows.map(row => row.value) });
  };

  const handleUploadType = async (type) => {
    imageUrls=[]
    setFormData({ ...formData, image: imageUrls });
    if(type==1){
      setUploadType(1)
      setRows([{ value: "" }]);
    }else setUploadType(2)
  }

  const handleUpdloadImage = async () => {
    try {
      if (!files[0]) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      for (let i = 0; i < files.length; i++) {
        const fileName = new Date().getTime() + "-" + files[i].name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, files[i]);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageUploadProgress(progress.toFixed(0));
          },
          (error) => {
            setImageUploadError("Image upload failed");
            setImageUploadProgress(null);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImageUploadProgress(null);
              setImageUploadError(null);
              imageUrls.push(downloadURL);
              setFormData({ ...formData, image: imageUrls });
            });
          }
        );
      }
      // const fileName = new Date().getTime() + '-' + file.name;
      // const storageRef = ref(storage, fileName);
      // const uploadTask = uploadBytesResumable(storageRef, file);
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if(imageUrls.length==0 && rows.length>0){
    //   for(let i in rows){
    //     console.log(rows[i].value)
    //     imageUrls.push(rows[i].value)
    //   }
    //   setFormData({ ...formData, image: imageUrls });
    // }
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="conceptual">Conceptual Photography</option>
            <option value="portrait">Portrait Photography</option>
            <option value="advertising">Advertising Photography</option>
            <option value="wedding">Wedding Photography</option>
            <option value="fashion">Fashion Photography</option>
            <option value="landscape">Landscape Photography</option>
            <option value="modern">Modern Art</option>
          </Select>
        </div>
        <Dropdown label="Upload Type">
          <Dropdown.Item onClick={() => handleUploadType(1)}>
            From my computer
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleUploadType(2)}>
            Import Image Urls
          </Dropdown.Item>
        </Dropdown>
        {uploadType == 1 ? (
          <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
            <FileInput
              multiple
              type="file"
              accept="image/*"
              helperText="SVG, PNG, JPG or GIF (MAX. 800x400px)."
              onChange={(e) => setFiles(e.target.files)}
            />
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              size="sm"
              outline
              onClick={handleUpdloadImage}
              disabled={imageUploadProgress}
            >
              {imageUploadProgress ? (
                <div className="w-16 h-16">
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}%`}
                  />
                </div>
              ) : (
                "Upload Image"
              )}
            </Button>
          </div>
        ) : (
          <div className="p-4">
            <Table>
              <Table.Head>
                <Table.HeadCell>Value</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {console.log(formData.image)}
                {rows.map((row, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>
                      <input
                        type="text"
                        value={row.value}
                        onChange={(e) => handleChange(index, e)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <button
              type="button"
              onClick={addRow}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Row
            </button>
          </div>
        )}

        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && uploadType==1 &&
          formData.image.map((url, index) => (
            <img
              key={index}
              src={url}
              alt="upload"
              className="w-full h-72 object-cover"
            />
          ))}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
