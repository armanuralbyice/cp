import axios from "axios";

export const fetchSemesterData = async () => {
    try {
        const res =
            await axios.get('https://cp-wine-mu.vercel.app/semester/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
        return res.data;
    } catch (err) {
        console.error(err);
        return []
    }
}
export const fetchDepartmentData = async () => {
    try {
        const res = await axios.get('https://cp-wine-mu.vercel.app/department/all', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        })
        return res.data
    } catch (err) {
        console.log(err)
        return []
    }
}
export const fetchClassRooms = async () => {
    try {
        const res = await axios.get('https://cp-wine-mu.vercel.app/classroom/all', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        });
        return res.data
    } catch (err) {
        console.log(err)
        return []
    }
}
export const fetchCourses = async (selectedDepartment) => {
    try {
        const res = await axios.get(`https://cp-wine-mu.vercel.app/course/filter?department=${selectedDepartment}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        })
        return res.data;
    } catch (err) {
        console.log(err);
        return []
    }
}
export const fetchFaculties = async (selectedDepartment) => {
    try {
        const res = await axios.get(`https://cp-wine-mu.vercel.app/user/department/${selectedDepartment}/faculties`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        })
        return res.data
    } catch (err) {
        console.log(err)
        return []
    }
}
export const fetchOfferCourses = async (semesterId, departmentId) => {
    try {
        const res = await axios.get(`https://cp-wine-mu.vercel.app/offer-course/all?semesterId=${semesterId}&departmentId=${departmentId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        })
        return res.data
    } catch (err) {
        console.log(err)
        return []
    }
}