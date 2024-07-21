import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const Logout = () => {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const response = await axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/logout`,
        withCredentials: true,
      });
      router.push(response.data);
      toast.success(response.data.success);
    } catch (error) {}
  };

  return (
    <button type="button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
