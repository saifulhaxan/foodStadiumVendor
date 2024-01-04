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
import { faClose, faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { BASE_URL } from "../../Api/apiConfig";
export const EditProduct = () => {
    const [unit, setUnit] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [menu, setMenu] = useState([]);
    const [files, setFiles] = useState([]);
    const [variations, setVariations] = useState([{ id: null, selectedVariation: null, items: [] }]);
    const [variationIds, setVariationIds] = useState([]);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [selectedItems, setSelectedItems] = useState({});

    const [items, setItems] = useState([]);
    const imageArray = [];
    const [formData, setFormData] = useState({
        // product_images: [], // Initialize image as an empty string
        customize_item_id: []
    });

    const [productImage, setProductImage] = useState('');

    const { id } = useParams();
    const base_url = 'https://custom2.mystagingserver.site/food-stadium/public/'

    const handleRemove = (imageId) => {
        // Find the index of the item with the specified imageId
        const indexToRemove = formData?.product_images.findIndex(item => item?.id === imageId);

        // If the item is found, create a new array without the removed item
        if (indexToRemove !== -1) {
            setFormData((prevFormData) => {
                const newProductImages = [...prevFormData.product_images.slice(0, indexToRemove), ...prevFormData.product_images.slice(indexToRemove + 1)];

                return {
                    ...prevFormData,
                    product_images: newProductImages,
                };
            });
            newImageShow()
        }


    };

    const handleSelectedItem = (variationId, itemId) => {
        // console.log(selectedItems)
        setSelectedItems((prevSelectedItems) => {
            const updatedItems = { ...prevSelectedItems };
            // console.log(selectedItems);

            if (!updatedItems[variationId]) {
                updatedItems[variationId] = [itemId];
            } else {
                if (updatedItems[variationId].includes(itemId)) {
                    // Item is already selected, so remove it
                    updatedItems[variationId] = updatedItems[variationId].filter((id) => id !== itemId);
                } else {
                    // Item is not selected, so add it
                    updatedItems[variationId] = [...updatedItems[variationId], itemId];
                }
            }

            return updatedItems;

        });

        // setFormData({
        //     ...formData,
        //     variation_id: selectedItems
        // })

        // console.log(selectedItems)
    };

    const fetchItemsForVariation = async (variationId) => {
        try {
            const response = await fetch(`${BASE_URL}api/vendor/get_item_by_variation/${variationId}`, {
                headers: {
                    'Authorization': `Bearer ${LogoutData}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            return data?.data; // Assuming the response has an 'items' property
        } catch (error) {
            console.error('Error fetching items:', error);
            return [];
        }
    };

    const handleVariationChange = async (value, index) => {
        const updatedVariations = [...variations];
        updatedVariations[index].selectedVariation = value;

        try {
            const items = await fetchItemsForVariation(value);
            updatedVariations[index].items = items;
            setVariations(updatedVariations);
        } catch (error) {
            console.error('Error updating items:', error);
        }
    };


    const handleAddVariation = () => {
        setVariations([...variations, { id: variations?.id, selectedVariation: null, items: [] }]);
    };

    const newImageShow = () => {
        formData?.product_images?.map((item) => {
            imageArray.push(item?.id)
        })

        console.log('image', imageArray)
    }


    useEffect(() => {
        newImageShow()
        console.log(formData)
    }, [])



    const editFetchData = () => {
        document.querySelector('.loaderBox').classList.remove("d-none");
        fetch(`${BASE_URL}public/api/vendor/edit_product/${id}`,
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
                // console.log(data?.data?.variation_id)
                document.querySelector('.loaderBox').classList.add("d-none");
                setFormData(data?.data)
                CustomizeMenuList(data?.data?.category_id)

            })
            .catch((error) => {
                document.querySelector('.loaderBox').classList.add("d-none");
                console.log(error);
            })
    }

    // console.log(formData)
    const categories = CategoryList();
    const dietary = DietaryList();
    const Menu = MenuList();


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        console.log(formData)
    };

    const handleCustomMenu = (event) => {
        const { value } = event.target;
        setFormData((prevFormData) => {
            let currentCustomizeItemId = prevFormData.customize_item_id;

            // Ensure customize_item_id is an array
            if (!Array.isArray(currentCustomizeItemId)) {
                currentCustomizeItemId = [];
            }

            const newCustomizeItemId = currentCustomizeItemId.includes(parseInt(value))
                ? currentCustomizeItemId.filter((item) => item !== parseInt(value))
                : [...currentCustomizeItemId, parseInt(value)];

            console.log('newCustomizeItemId:', newCustomizeItemId);

            return {
                ...prevFormData,
                customize_item_id: newCustomizeItemId
            };
        });

        console.log('formData:', formData);
    };





    const fetchMenu = (event) => {
        const { value } = event.target
        console.log(value)
        CustomizeMenuList(value)
        handleChange(event)
    }

    const filehandleChange = (event) => {
        const file = event.target.files;
        const fileName = file;
        setFiles(fileName)
        console.log(files)
    };

    const SinglefilehandleChange = (event) => {
        const file = event.target.files[0];
        const fileName = file;
        setProductImage(fileName)
    }



    const CustomizeMenuList = (idMenu) => {
        document.querySelector('.loaderBox').classList.remove("d-none");
        fetch(`${BASE_URL}public/api/vendor/customize_menu_by_category/${idMenu}`,
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
                console.log('meny', data)
                document.querySelector('.loaderBox').classList.add("d-none");
                setMenu(data?.data)

            })
            .catch((error) => {
                document.querySelector('.loaderBox').classList.add("d-none");
                console.log(error);
            })
    }






    const LogoutData = localStorage.getItem('login');

    const addProductImages = () => {
        const formDataMethod = new FormData();
        if (files != "") {
            for (let i = 0; i < files.length; i++) {
                console.log(files[i]);
                formDataMethod.append(`product_images[]`, files[i]);

            }
        }

        if (productImage != "") {
            formDataMethod.append('feature_image', productImage)
        }

        fetch(`${BASE_URL}public/api/vendor/multiple_product_image/${id}`, {
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
            })
            .catch((error) => {
                document.querySelector('.loaderBox').classList.add("d-none");
                console.log(error)
            })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        newImageShow()

        // Create a new FormData object
        const formDataMethod = new FormData();
        for (const key in formData) {
            if (key != 'product_images') {
                formDataMethod.append(key, formData[key]);
            }
        }

        formDataMethod.append('product_images', imageArray)

        console.log(formData)
        if (files != "" || productImage != "") {
            addProductImages()
        }

        if (selectedItems) {
            formDataMethod.append(`variation_id`, JSON.stringify(selectedItems));
        }

        document.querySelector('.loaderBox').classList.remove("d-none");
        // Make the fetch request
        fetch(`${BASE_URL}public/api/vendor/product_add_update/${id}`, {
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
            })
            .catch((error) => {
                document.querySelector('.loaderBox').classList.add("d-none");
                console.log(error)
            })
    };


    useEffect(() => {
        editFetchData()
    }, [])


    useEffect(() => {
        const fetchVariationIds = async () => {
            try {
                const response = await fetch('https://custom2.mystagingserver.site/food-stadium/public/api/vendor/variation_list', {
                    headers: {
                        'Authorization': `Bearer ${LogoutData}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                setVariationIds(data?.data);
            } catch (error) {
                console.error('Error fetching variation IDs:', error);
            }
        };

        fetchVariationIds();
    }, []);

    console.log(formData?.category_id)



    const handleRemoveVariation = (index) => {
        setVariations((prevVariations) => {
            const updatedVariations = [...prevVariations];
            updatedVariations.splice(index, 1);
            return updatedVariations;

        });
        console.log(variations)
    };



    return (
        <>
            <DashboardLayout>
                <div className="dashCard mb-4">
                    <div className="row mb-3">
                        <div className="col-12 mb-2">
                            <h2 className="mainTitle">
                                <BackButton />
                                Edit Product
                            </h2>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-12">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="row">
                                            <div className="col-md-6 mb-4">
                                                <CustomInput
                                                    label='Edit Product Name'
                                                    required
                                                    id='name'
                                                    type='text'
                                                    placeholder='Enter Product Name'
                                                    labelClass='mainLabel'
                                                    inputClass='mainInput'
                                                    name="title"
                                                    value={formData.title}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <CustomInput
                                                    label='Enter price'
                                                    required
                                                    id='price'
                                                    type='number'
                                                    placeholder='Enter price'
                                                    labelClass='mainLabel'
                                                    inputClass='mainInput'
                                                    name="product_price"
                                                    value={formData.product_price}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-12 mb-4">
                                                <SelectBox
                                                    selectClass="mainInput"
                                                    name="category_id"
                                                    label="Select Category"
                                                    placeholder="Select Category"
                                                    required
                                                    value={formData.category_id}
                                                    option={categories}
                                                    onChange={fetchMenu}
                                                />

                                            </div>
                                            {/* {menu && menu.length > 0 ? (
                                                <div className="col-md-6 mb-4">
                                                    <SelectBox
                                                        selectClass="mainInput"
                                                        name="customize_item_id"
                                                        label="Edit Customize Menu"
                                                        placeholder="Select Menu's"
                                                        required
                                                        value={formData.customize_item_id}
                                                        option={menu}
                                                        onChange={handleChange}
                                                    />

                                                </div>
                                            ) : ''
                                            } */}

                                            {/* <div className="col-md-12 mb-4">

                                                <div className="menuListItem row">
                                                    <div className="col-md-12 mb-4">
                                                        <h4>{`Customize Menu`}</h4>
                                                    </div>
                                                    {menu && menu.map((item) => (
                                                        <div className="customDataItem col-md-4 mb-4">
                                                            <div className="checkList">
                                                                <input
                                                                    type="checkbox"
                                                                    value={item?.id}
                                                                    id={item?.id}
                                                                    name="addons[]"
                                                                    onClick={handleCustomMenu}
                                                                    checked={formData?.customize_item_id && formData.customize_item_id.includes(item?.id)}
                                                                />


                                                            </div>
                                                            <label for={item?.id}>
                                                                <div className="productAdonItem">
                                                                    <div className="productImageIcon">
                                                                        <img src={base_url + item?.item_pic} />
                                                                    </div>
                                                                    <div className="addonDesc">
                                                                        <h5 className="text-capitalize">{item?.item_name}</h5>
                                                                        <p>{`$ ${item?.item_price}`}</p>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </div>
                                                    ))
                                                    }
                                                </div>

                                            </div> */}


                                            {/* edit varaiation data  */}
                                            {/* <>
                                                {
                                                    formData?.variation_id &&
                                                    Object.entries(formData.variation_id).map(([key, values], index) => (
                                                        <div key={index}>
                                                            <p>{key}:</p>
                                                            {values.map((value, subIndex) => (
                                                                <p key={subIndex}>{value}</p>
                                                            ))}
                                                        </div>
                                                    ))
                                                }
                                            </> */}

                                            <div className="variationData">
                                        
                                                {variations.map((variation, index) => (
                                                    <div key={variation.id} className="col-md-6">
                                                        <h6 className="font-weight-bold">Variation Box {index + 1}</h6>
                                                        <div className="form-controls mb-4 d-flex align-items-center gap-3">
                                                            <select
                                                                className="mainInput"
                                                                onChange={(e) => handleVariationChange(e.target.value, index)}
                                                                value={variation.selectedVariation || ''}
                                                            >
                                                                <option>Select Variation</option>
                                                                {variationIds
                                                                    .filter((item) => variations.every((v) => v.selectedVariation !== item.id))
                                                                    .map((item) => (
                                                                        <option key={item.id} value={item.id}>
                                                                            {item.name}
                                                                        </option>
                                                                    ))}
                                                            </select>
                                                            <div className="d-flex justify-content-end">
                                                                <button onClick={handleAddVariation} type="button" className="btn primaryButton text-white addBtn"><FontAwesomeIcon icon={faPlusCircle}></FontAwesomeIcon></button>
                                                                <button onClick={() => { handleRemoveVariation(index) }} type="button" className="btn primaryButton text-white trashBtn"><FontAwesomeIcon icon={faMinusCircle}></FontAwesomeIcon></button>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            {variation.items.map((item) => (
                                                                <div key={item.id} className="customDataItem col-md-4 mb-4" id={item?.variation_id}>
                                                                    <div className="checkList">
                                                                        <input
                                                                            type="checkbox"
                                                                            value={item?.id}
                                                                            id={item?.id}
                                                                            name="addons[]"
                                                                            onClick={() => handleSelectedItem(item?.variation_id, item?.id)}
                                                                            checked={selectedItems[item?.variation_id]?.includes(item?.id)}
                                                                        />
                                                                    </div>
                                                                    <label for={item?.id}>
                                                                        <div className="productAdonItem">
                                                                            <div className="productImageIcon">
                                                                                <img src={base_url + item?.image} />
                                                                            </div>
                                                                            <div className="addonDesc">
                                                                                <h5 className="text-capitalize">{item?.title}</h5>
                                                                                <p>{`$ ${item?.price}`}</p>
                                                                            </div>
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}

                                            </div>


                                            {/* <div className="variationData">
                                                <div className="d-flex justify-content-end mb-4">
                                                    <button onClick={handleAddVariation} type="button" className="btn bg-primary text-white">Add More Variation</button>
                                                </div>
                                                {formData?.variation_id.map((variation, index) => (
                                                    <div key={variation.id} className="col-md-12">
                                                        <h6>Variation Box {index + 1}</h6>
                                                        <div className="form-controls mb-4">
                                                            <select
                                                                className="mainInput"
                                                                onChange={(e) => handleVariationChange(e.target.value, index)}
                                                                value={variation.selectedVariation || ''}
                                                            >
                                                                <option value="">Select Variation</option>
                                                                {variationIds.map((item) => (
                                                                    <option key={item.id} value={item.id}>{item.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="row">
                                                            {variation.items.map((item) => (
                                                                <div key={item.id} className="customDataItem col-md-4 mb-4" id={item?.variation_id}>
                                                                    <div className="checkList">
                                                                        <input
                                                                            type="checkbox"
                                                                            value={item?.id}
                                                                            id={item?.id}
                                                                            name="addons[]"
                                                                            onClick={() => handleSelectedItem(item?.variation_id, item?.id)}
                                                                            checked={selectedItems[item?.variation_id]?.includes(item?.id)}
                                                                        />
                                                                    </div>
                                                                    <label for={item?.id}>
                                                                        <div className="productAdonItem">
                                                                            <div className="productImageIcon">
                                                                                <img src={base_url + item?.image} />
                                                                            </div>
                                                                            <div className="addonDesc">
                                                                                <h5 className="text-capitalize">{item?.title}</h5>
                                                                                <p>{`$ ${item?.price}`}</p>
                                                                            </div>
                                                                        </div>
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}

                                            </div> */}
                                            {/* end  */}


                                            <div className="col-md-6 mb-4">
                                                <SelectBox
                                                    selectClass="mainInput"
                                                    name="dietary_id"
                                                    label="Select Dietary"
                                                    placeholder="Select Dietary"
                                                    required
                                                    value={formData.dietary_id}
                                                    option={dietary}
                                                    onChange={handleChange}
                                                />

                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <SelectBox
                                                    selectClass="mainInput"
                                                    name="menu_id"
                                                    label="Select Menu"
                                                    placeholder="Select Menu"
                                                    required
                                                    value={formData.menu_id}
                                                    option={Menu}
                                                    onChange={handleChange}
                                                />

                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <CustomInput
                                                    label='Upload Gallery Image'

                                                    id='file'
                                                    type='file'
                                                    multiple
                                                    labelClass='mainLabel'
                                                    inputClass='mainInput'
                                                    name="image"
                                                    // value={formData.image}
                                                    onChange={filehandleChange}
                                                />
                                                <div className="galleryBox row">
                                                    {
                                                        formData?.product_images && formData?.product_images?.map((item) => (
                                                            <div className="galleryItem col-md-3 mb-3 position-relative">
                                                                <img src={base_url + item?.image} />
                                                                <div className="removeImage" onClick={() => {
                                                                    handleRemove(item?.id)
                                                                }}>
                                                                    <button type="button">
                                                                        <FontAwesomeIcon icon={faClose} ></FontAwesomeIcon>

                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <CustomInput
                                                    label='Upload Product Image'

                                                    id='file'
                                                    type='file'
                                                    multiple
                                                    labelClass='mainLabel'
                                                    inputClass='mainInput'
                                                    name="image"
                                                    // value={formData.image}
                                                    onChange={SinglefilehandleChange}
                                                />
                                                <div className="galleryBox row justify-content-center">
                                                    <div className="galleryItem col-md-3 mb-3 position-relative">
                                                        <img src={base_url + formData?.feature_image} />
                                                        {/* <div className="removeImage" onClick={() => {
                                                            handleRemove()
                                                        }}>
                                                            <button type="button">
                                                                <FontAwesomeIcon icon={faClose} ></FontAwesomeIcon>

                                                            </button>
                                                        </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12 mb-4">
                                                <div className="inputWrapper">
                                                    <div className="form-controls">
                                                        <label htmlFor="">Description</label>
                                                        <textarea
                                                            name="description"
                                                            className="form-control shadow border-0"
                                                            id=""
                                                            cols="30"
                                                            rows="10"
                                                            value={formData.description}
                                                            onChange={handleChange}
                                                        >
                                                        </textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <CustomButton variant='primaryButton' text='Update' type='submit' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <CustomModal show={showModal} close={() => { setShowModal(false) }} success heading='Product Updated Successfully.' />

            </DashboardLayout>
        </>
    );
};

