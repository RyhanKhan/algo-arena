import { firestore } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";

const [inputs, setInputs] = useState({
  id: "",
  title: "",
  difficulty: "",
  category: "",
  videoId: "",
  link: "",
  order: 0,
  likes: 0,
  dislikes: 0,
});

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setInputs({
    ...inputs,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const newProblem = {
    ...inputs,
    order: Number(inputs.order),
  };
  await setDoc(doc(firestore, "problems", inputs.id), inputs);
  alert("saved to db");
};

{
  /* <form
          onSubmit={handleSubmit}
          className="p-6 flex flex-col max-w-sm gap-3"
        >
          <input
            onChange={handleInputChange}
            type="text"
            placeholder="problem id"
            name="id"
          />
          <input
            onChange={handleInputChange}
            type="text"
            placeholder="title"
            name="title"
          />
          <input
            onChange={handleInputChange}
            type="text"
            placeholder="difficulty"
            name="difficulty"
          />
          <input
            onChange={handleInputChange}
            type="text"
            placeholder="category"
            name="category"
          />
          <input
            onChange={handleInputChange}
            type="text"
            placeholder="order"
            name="order"
          />
          <input
            onChange={handleInputChange}
            type="text"
            placeholder="videoId?"
            name="videoId?"
          />
          <input
            onChange={handleInputChange}
            type="text"
            placeholder="link?"
            name="link?"
          />
          <button className="bg-white">Save to DB</button>
        </form> */
}
