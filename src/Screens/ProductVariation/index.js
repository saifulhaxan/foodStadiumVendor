import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faEye, faCheck, faTimes, faFilter, faEdit } from "@fortawesome/free-solid-svg-icons";

import { DashboardLayout } from "../../Components/Layout/DashboardLayout";
import CustomTable from "../../Components/CustomTable";
import CustomModal from "../../Components/CustomModal";

import CustomPagination from "../../Components/CustomPagination"
import CustomInput from "../../Components/CustomInput";
import CustomButton from "../../Components/CustomButton";
import { BASE_URL } from "../../Api/apiConfig";


// import "./style.css";

export const ProductVariation = () => {
    const base_url = 'https://custom2.mystagingserver.site/food-stadium/public/'
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    const [showModal4, setShowModal4] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [addVariation, setAddVariation] = useState(false)
    const [editVariation, setEditVariation] = useState(false)
    const [inputValue, setInputValue] = useState('');
    const [formData, setFormData] = useState();
    const LogoutData = localStorage.getItem('login');


    const navigate = useNavigate();

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    console.log();

    const hanldeRoute = () => {
        navigate('/add-product')
    }


    const inActive = () => {
        setShowModal(false)
        setShowModal2(true)
    }
    const ActiveMale = () => {
        setShowModal3(false)
        setShowModal4(true)
    }

    const handleChange = (e) => {
        setInputValue(e.target.value);
    }

    const filterData = data.filter(item =>
        item?.name?.toLowerCase().includes(inputValue.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filterData.slice(indexOfFirstItem, indexOfLastItem);


    const VariationData = () => {
        document.querySelector('.loaderBox').classList.remove("d-none");
        fetch(`${BASE_URL}public/api/vendor/variation_list`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${LogoutData}`
                },
            }
        )

            .then(response =>
                response.json()
            )
            .then((data) => {
                console.log(data)
                document.querySelector('.loaderBox').classList.add("d-none");
                setData(data.data);
            })
            .catch((error) => {
                document.querySelector('.loaderBox').classList.add("d-none");
                console.log(error)
            })

    }

    useEffect(() => {
        document.title = 'Food Stadium Vendor | Product Variation';
        VariationData()

    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataMethod = new FormData();
        for (const key in formData) {
            formDataMethod.append(key, formData[key]);
        }
        console.log(formData)
        document.querySelector('.loaderBox').classList.remove("d-none");
        // Make the fetch request
        fetch(`${BASE_URL}public/api/vendor/variation_add_update/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${LogoutData}`
            },
            body: formDataMethod // Use the FormData object as the request body
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                document.querySelector('.loaderBox').classList.add("d-none");
                console.log(data);
                setAddVariation(false)
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                }, 1000)
                VariationData()
            })
            .catch((error) => {
                document.querySelector('.loaderBox').classList.add("d-none");
                console.log(error)
            })
    }

    const handleUpdateVariation = (e) => {
        e.preventDefault();
        const varidationId = localStorage.getItem('variationId');
        const formDataMethod = new FormData();
        for (const key in formData) {
            formDataMethod.append(key, formData[key]);
        }
        console.log(formData)
        document.querySelector('.loaderBox').classList.remove("d-none");
        // Make the fetch request
        fetch(`${BASE_URL}public/api/vendor/variation_add_update/${varidationId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${LogoutData}`
            },
            body: formDataMethod // Use the FormData object as the request body
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                document.querySelector('.loaderBox').classList.add("d-none");
                console.log(data);
                setShowModal(true);
                setEditVariation(false)
                setTimeout(() => {
                    setShowModal(false);
                }, 1000)
                VariationData()
            })
            .catch((error) => {
                document.querySelector('.loaderBox').classList.add("d-none");
                console.log(error)
            })
    }

    const maleHeaders = [
        {
            key: "id",
            title: "S.No",
        },
        {
            key: "Variation Name",
            title: "Variation Name",
        },
        {
            key: "item",
            title: "Items",
        },
        {
            key: "created_at",
            title: "Created On",
        },
        {
            key: "action",
            title: "Action",
        }
    ];


    const handleEdit = (data) => {
        document.querySelector('.loaderBox').classList.remove("d-none");
        fetch(`${BASE_URL}public/api/vendor/view_variation/${data}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${LogoutData}`
                },
            }
        )

            .then(response =>
                response.json()
            )
            .then((data) => {
                console.log(data?.data?.id)
                localStorage.setItem('variationId', data?.data?.id);
                document.querySelector('.loaderBox').classList.add("d-none");
                setFormData({
                    ...formData, name: data?.data?.name
                });
                console.log(formData)
                setEditVariation(true)

            })
            .catch((error) => {
                document.querySelector('.loaderBox').classList.add("d-none");
                console.log(error)
            })
    }

    return (
        <>
            <DashboardLayout>
                <div className="container-fluid">
                    <div className="row mb-3">
                        <div className="col-12">
                            <div className="dashCard">
                                <div className="row mb-3 justify-content-between">
                                    <div className="col-md-6 mb-2">
                                        <h2 className="mainTitle">Product Variations</h2>
                                    </div>
                                    <div className="col-md-6 mb-2">
                                        <div className="addUser">
                                            <CustomButton text="Add New Variation" variant='primaryButton' onClick={() => {
                                                setAddVariation(true)
                                            }} />
                                            <CustomInput type="text" placeholder="Search Here..." value={inputValue} inputClass="mainInput" onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className="col-12">
                                        <CustomTable
                                            headers={maleHeaders}

                                        >
                                            <tbody>
                                                {currentItems.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td className="text-capitalize">
                                                            {item?.name}
                                                        </td>
                                                        <td>{item?.variation_items_count}</td>
                                                        <td>{item?.created_at}</td>
                                                        {/* <td className={item.status == 1 ? 'greenColor' : "redColor"}>{item.status == 1 ? 'Active' : "Inactive"}</td> */}
                                                        <td>
                                                            <Dropdown className="tableDropdown">
                                                                <Dropdown.Toggle variant="transparent" className="notButton classicToggle">
                                                                    <FontAwesomeIcon icon={faEllipsisV} />
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu align="end" className="tableDropdownMenu">

                                                                    <Link to={`/product-variation/view-details/${item?.id}`} className="tableAction"><FontAwesomeIcon icon={faEye} className="tableActionIcon" />View</Link>
                                                                    <CustomButton className="tableAction" onClick={() => { handleEdit(item?.id) }}><FontAwesomeIcon icon={faEdit} className="tableActionIcon"

                                                                    />Edit</CustomButton>
                                                                    {/* <Link to={`/product-management/edit-product/${item?.id}`} className="tableAction"><FontAwesomeIcon icon={faEdit} className="tableActionIcon" />Edit</Link> */}

                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </CustomTable>
                                        <CustomPagination
                                            itemsPerPage={itemsPerPage}
                                            totalItems={data.length}
                                            currentPage={currentPage}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <CustomModal show={addVariation} close={() => { setAddVariation(false) }} >
                        <CustomInput
                            label="Add Variation"
                            type="text"
                            placeholder="Add Variation"
                            required
                            name="name"
                            labelClass='mainLabel'
                            inputClass='mainInput'
                            onChange={(event) => {
                                setFormData({ ...formData, name: event.target.value });
                                console.log(formData);
                            }}

                        />
                        <CustomButton variant='primaryButton' text='Add' type='submit' onClick={handleSubmit} />
                    </CustomModal>


                    <CustomModal show={editVariation} close={() => { setEditVariation(false) }} >
                        <CustomInput
                            label="Edit Variation"
                            type="text"
                            placeholder="Edit Variation"
                            required
                            name="name"
                            labelClass='mainLabel'
                            inputClass='mainInput'
                            value={formData?.name}
                            onChange={(event) => {
                                setFormData({ ...formData, name: event.target.value });
                                console.log(formData);
                            }}

                        />
                        <CustomButton variant='primaryButton' text='Update' type='submit' onClick={handleUpdateVariation} />
                    </CustomModal>

                    <CustomModal show={showModal} close={() => { setShowModal(false) }} success heading='Variation Added Successfully' />




                </div>
            </DashboardLayout>
        </>
    );
};
