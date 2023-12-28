import { useState, useEffect } from "react";
import { DashboardLayout } from "../../Components/Layout/DashboardLayout";
import BackButton from "../../Components/BackButton";
import CustomModal from "../../Components/CustomModal";
import CustomInput from '../../Components/CustomInput';
import { SelectBox } from "../../Components/CustomSelect";
import CustomButton from "../../Components/CustomButton";
import { CategoryList, DietaryList, MenuList } from "../../Components/CategoryList";
import { useParams } from "react-router";
import './style.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { BASE_URL } from "../../Api/apiConfig";
import Accordion from 'react-bootstrap/Accordion';

export const OrderDetails = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [variationItem, setVariationItem] = useState();
    const LogoutData = localStorage.getItem('login');
    const { id } = useParams();
    const base_url = 'https://custom2.mystagingserver.site/food-stadium/public/'

    const GetItem = () => {
        document.querySelector('.loaderBox').classList.remove("d-none");
        fetch(`${BASE_URL}public/api/order_detail/${id}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${LogoutData}`
                },
            }
        )
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                document.querySelector('.loaderBox').classList.add("d-none");
                console.log(data?.data)
                setFormData(data?.data)
            })
            .catch((error) => {
                document.querySelector('.loaderBox').classList.add("d-none");
                console.log(error);
            })
    }


    useEffect(() => {
        GetItem()
    }, [])

    const SinglefilehandleChange = (event) => {
        const file = event.target.files[0];
        const fileName = file;
        setFormData({
            ...formData,
            image: fileName
        })
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        console.log(formData)
    };



    const handleSubmit = (event) => {
        event.preventDefault();
        const formDataMethod = new FormData();
        for (const key in formData) {
            formDataMethod.append(key, formData[key]);
        }

        formDataMethod.append('product_images', formData?.image)
        formDataMethod.append('variation_id', id)

        console.log(formData)


        document.querySelector('.loaderBox').classList.remove("d-none");
        // Make the fetch request
        fetch(`${BASE_URL}public/api/vendor/variation_item_add_update`, {
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
                setShowModal(true)
                setTimeout(() => {
                    setShowModal(false)
                }, 1000)
                GetItem()
            })
            .catch((error) => {
                document.querySelector('.loaderBox').classList.add("d-none");
                console.log(error)
            })
    };





    return (
        <>
            <DashboardLayout>
                <div className="dashCard mb-4">
                    <div className="row mb-3">
                        <div className="col-12 mb-2">
                            <h2 className="mainTitle">
                                <BackButton />
                                Order Detail
                            </h2>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-12">
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <div className="boxInfo">
                                        <h5 className="font-weight-bold">User Name</h5>
                                        <p>{formData?.user_name}</p>
                                    </div>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <div className="boxInfo">
                                        <h5 className="font-weight-bold">Zip code</h5>
                                        <p>{formData?.zipcode}</p>
                                    </div>
                                </div>
                                <div className="col-md-3 mb-3">
                                    <div className="boxInfo">
                                        <h5 className="font-weight-bold">Delivery Date</h5>
                                        <p>{formData?.delivery_date}</p>
                                    </div>
                                </div>
                                {
                                    formData?.coupon_code && (
                                        <div className="col-md-3 mb-3">
                                            <div className="boxInfo">
                                                <h5 className="font-weight-bold">Coupon Code</h5>
                                                <p>{formData?.coupon_code}</p>
                                            </div>
                                        </div>
                                    )
                                }

                                <div className="col-md-3 mb-3">
                                    <div className="boxInfo">
                                        <h5 className="font-weight-bold">Delivery Type</h5>
                                        <p>{formData?.delivery_type == 0 ? 'Pick Up' : 'Delivery'}</p>
                                    </div>
                                </div>

                            </div>
                        </div>




                    </div>

                    <div className="row mb-3">
                        <div className="col-md-12">
                            <h5 className="mb-4">Products Details</h5>
                            <Accordion>
                                {
                                    formData?.order_products && formData?.order_products.map((item, index) => (
                                        <Accordion.Item eventKey={index}>
                                            <Accordion.Header><h5 className="text-capitalize">{item?.product?.title} <span> x {item?.product_id}</span></h5></Accordion.Header>
                                            <Accordion.Body>
                                                <div className="col-md-12">
                                                    <h3 className="subHeading mt-5">Variation Item</h3>
                                                    <div className="variationList">
                                                        {item?.variation_item && item?.variation_item?.map((list, index) => (
                                                           <h4>{list?.title}</h4>
                                                        ))}
                                                    </div>
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))
                                }

                            </Accordion>
                        </div>
                    </div>
                    <div className="row mb-3 justify-content-end">
                        <div className="col-md-4">
                            <div className="checkoutBox shadow p-4">
                                <table className="table table-striped">
                                    <tr>
                                        <td>Product</td>
                                        <td>Quantity</td>
                                        <td>Price</td>
                                    </tr>
                                    <tr>
                                        {
                                            formData?.order_products && formData?.order_products.map((item, index) => (
                                                <td></td>
                                            ))
                                        }

                                    </tr>
                                </table>
                                <div className="d-flex justify-content-between">
                                    <div className="totalTilte">
                                        <h6>Total Amount</h6>
                                    </div>
                                    <div className="totalAmount">
                                        <h6>{`$ ${formData?.total}`}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <CustomModal show={showModal} close={() => { setShowModal(false) }} success heading='Item Added Successfully.' />

            </DashboardLayout>
        </>
    );
};

