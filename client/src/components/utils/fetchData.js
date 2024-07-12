import axios from "axios";
import { toast } from "react-toastify";
export const fetchDepartmentData = async () => {
    try {
        const res = await axios.get('http://localhost:4000/department/all',
            // {
            //     headers: {
            //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
            //         'Content-Type': 'application/json',
            //     },
            // }
        )
        return res.data
    } catch (err) {
        console.log(err)
        return []
    }
}
export const fetchSemesterData = async () => {
    try {
        const res =
            await axios.get('http://localhost:4000/semester/all', {
                // headers: {
                //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
                //     'Content-Type': 'application/json',
                // },
            });
        return res.data;
    } catch (err) {
        console.error(err);
        return []
    }
}