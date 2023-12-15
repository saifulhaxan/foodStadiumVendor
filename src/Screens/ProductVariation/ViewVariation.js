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

export const ViewVariation = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [variationItem, setVariationItem] = useState();
    const LogoutData = localStorage.getItem('login');
    const { id } = useParams();
    const base_url = 'https://custom2.mystagingserver.site/food-stadium/public/'

    const GetItem = () => {
        document.querySelector('.loaderBox').classList.remove("d-none");
        fetch(`${BASE_URL}public/api/vendor/get_item_by_variation/${id}`,
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
                console.log(data)
                setVariationItem(data?.data)
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
                setTimeout(()=>{
                    setShowModal(false)
                },1000)
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
                                View Variation
                            </h2>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-12">
                            <h3 className="subHeading">Add Variation Item</h3>
                        </div>
                        <div className="col-12">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="row">
                                            <div className="col-md-6 mb-4">
                                                <CustomInput
                                                    label='Add Item Name'
                                                    required
                                                    id='name'
                                                    type='text'
                                                    placeholder='Add Item Name'
                                                    labelClass='mainLabel'
                                                    inputClass='mainInput'
                                                    name="title"

                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <CustomInput
                                                    label='Add Item Price'
                                                    required
                                                    id='price'
                                                    type='number'
                                                    placeholder='Add Item Price'
                                                    labelClass='mainLabel'
                                                    inputClass='mainInput'
                                                    name="price"
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-md-6 mb-4">
                                                <CustomInput
                                                    label='Upload Item Image'
                                                    required
                                                    id='file'
                                                    type='file'
                                                    multiple
                                                    labelClass='mainLabel'
                                                    inputClass='mainInput'
                                                    name="image"
                                                    // value={formData.image}
                                                    onChange={SinglefilehandleChange}
                                                />
                                            </div>

                                            <div className="col-md-12">
                                                <CustomButton variant='primaryButton' text='Add Item' type='submit' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {variationItem != "" ? (
                            <div className="col-md-12">
                                <h3 className="subHeading mt-5">Variation Item</h3>
                                <div className="variationList">
                                    {variationItem && variationItem.map((item, index) => (
                                        <div className="customDataItem mb-4">
                                            <div className="productAdonItem">
                                                <div className="productImageIcon">
                                                    <img src={base_url + item?.image} />
                                                </div>
                                                <div className="addonDesc">
                                                    <h5 className="text-capitalize">{item?.title}</h5>
                                                    <p>{`$ ${item?.price}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (<p className="text-center">No Item in this Variation</p>)}



                    </div>
                </div>

                <CustomModal show={showModal} close={() => { setShowModal(false) }} success heading='Item Added Successfully.' />

            </DashboardLayout>
        </>
    );
};

