import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const issueTypes = [
  "Order issue",
  "Product inquiry",
  "Technical support",
  "Billing question",
  "Other",
];

export default function SupportPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: issueTypes[0],
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      navigate("/");
    }, 1400);
  };

 
}
