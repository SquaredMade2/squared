import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

const Logout = () => {
  const { toast } = useToast();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/logout`,
        withCredentials: true,
      });
      router.replace("/login");
      toast({ title: response.data.success });
    } catch (error) {}
  };

  return (
    <button type="button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
