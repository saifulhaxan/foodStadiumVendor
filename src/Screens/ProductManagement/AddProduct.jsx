import { useState, useEffect } from "react";
import { DashboardLayout } from "../../Components/Layout/DashboardLayout";
import BackButton from "../../Components/BackButton";
import CustomModal from "../../Components/CustomModal";
import CustomInput from '../../Components/CustomInput';
import { SelectBox } from "../../Components/CustomSelect";
import CustomButton from "../../Components/CustomButton";
import { CategoryList, DietaryList, MenuList } from "../../Components/CategoryList";
import './style.css'
import { BASE_URL } from "../../Api/apiConfig";
import { json } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
export const AddProduct = () => {
    const [unit, setUnit] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [menu, setMenu] = useState([]);
    const [files, setFiles] = useState([]);

    const [variations, setVariations] = useState([{ id: null, selectedVariation: null, items: [] }]);
    const [variationIds, setVariationIds] = useState([]);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [selectedItems, setSelectedItems] = useState({});
    const [items, setItems] = useState([]);
    const [type, setType] = useState(false)


    const [formData, setFormData] = useState({
        // product_images: [], // Initialize image as an empty string
        // customize_item_id: []
    });

    const base_url = 'https://custom2.mystagingserver.site/food-stadium/public/'

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

        // console.log(formData)
    };

    const handleCustomMenu = (event) => {
        const { value } = event.target;
        const isChecked = event.target.checked;

        if (isChecked) {
            setFormData({
                ...formData,
                customize_item_id: [...formData.customize_item_id, parseInt(value)]
            });
        } else {
            // Use the filter function to create a new array excluding the unchecked value
            setFormData({
                ...formData,
                customMenu: formData.customMenu.filter((id) => id !== value)
            });
        }

        console.log(formData);
    };


    const fetchMenu = (event) => {
        const { value } = event.target
        console.log(value)
        // CustomizeMenuList(value)
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
        setFormData({
            ...formData,
            feature_image: fileName
        })
    }

    const CustomizeMenuList = (id) => {
        document.querySelector('.loaderBox').classList.remove("d-none");
        fetch(`${BASE_URL}public/api/vendor/customize_menu_by_category/${id}`,
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
                console.log(data)
                document.querySelector('.loaderBox').classList.add("d-none");
                setMenu(data?.data)

            })
            .catch((error) => {
                document.querySelector('.loaderBox').classList.add("d-none");
                console.log(error);
            })
    }




    const LogoutData = localStorage.getItem('login');


    const handleSubmit = (event) => {
        event.preventDefault();

        // Create a new FormData object
        const formDataMethod = new FormData();
        for (const key in formData) {
            formDataMethod.append(key, formData[key]);
        }

        if (type) {
            formDataMethod.append(`variation_id`, JSON.stringify(selectedItems));
        }


        const imagesArray = [];
        for (let i = 0; i < files.length; i++) {
            console.log(files[i]);
            formDataMethod.append(`product_images[]`, files[i]);

        }

        console.log(typeof (imagesArray));

        console.log(formData)
        document.querySelector('.loaderBox').classList.remove("d-none");
        // Make the fetch request
        fetch(`${BASE_URL}public/api/vendor/product_add_update`, {
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


    // variation process 

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

    // const handleVariationChange = async (value, index) => {
    //     const updatedVariations = [...variations];
    //     updatedVariations[index].selectedVariation = value;


    //     try {
    //         const items = await fetchItemsForVariation(value);
    //         updatedVariations[index].items = items;
    //         setVariations(updatedVariations);
    //         console.log(variations)
    //     } catch (error) {
    //         console.error('Error updating items:', error);
    //     }
    // };

    const handleAddVariation = () => {
        setVariations((prevVariations) => {
            const newVariation = { id: null, selectedVariation: null, items: [] };
            return [...prevVariations, newVariation];
        });
    };


    const handleRemoveVariation = (index) => {
        setVariations((prevVariations) => {
            const updatedVariations = [...prevVariations];
            updatedVariations.splice(index, 1);
            return updatedVariations;

        });
        console.log(variations)
    };

    const handleVariationChange = async (value, index) => {
        const updatedVariations = [...variations];
        updatedVariations[index] = { ...updatedVariations[index], selectedVariation: value };

        try {
            const items = await fetchItemsForVariation(value);
            updatedVariations[index].items = items;
            setVariations(updatedVariations);
            console.log(formData)
        } catch (error) {
            console.error('Error updating items:', error);
        }
    };



    return (
        <>
            <DashboardLayout>
                <div className="dashCard mb-4">
                    <div className="row mb-3">
                        <div className="col-12 mb-2">
                            <h2 className="mainTitle">
                                <BackButton />
                                Add New Product
                            </h2>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-12">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="productType">
                                                    <CustomInput
                                                        type="radio"
                                                        name="type"
                                                        value="simple"
                                                        label="Simple Product"
                                                        id="simple"
                                                        onChange={(() => {
                                                            setType(false)
                                                        })}
                                                    ></CustomInput>
                                                    <CustomInput
                                                        type="radio"
                                                        name="type"
                                                        value="variable"
                                                        label="Variation Product"
                                                        id="variable"
                                                        onChange={(() => {
                                                            setType(true)
                                                        })}
                                                    ></CustomInput>
                                                </div>
                                            </div>
                                            <div className="col-md-4 mb-4">
                                                <CustomInput
                                                    label='Add Product Name'
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
                                            <div className="col-md-4 mb-4">
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
                                            <div className="col-md-4 mb-4">
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

                                            {/* <div className="col-md-12 mb-4">
                                                {
                                                    menu != '' ? (
                                                        <div className="col-md-12 mb-4">
                                                            <h4>{`Customize Menu`}</h4>
                                                        </div>
                                                    ) : ''
                                                }
                                                <div className="menuListItem row">
                                                    {menu && menu.map((item) => (
                                                        <>
                                                            <div className="customDataItem col-md-4 mb-4">
                                                                <div className="checkList">
                                                                    <input type="checkbox" value={item?.id} id={item?.id} name="addons[]" onClick={handleCustomMenu} />
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
                                                        </>
                                                    ))
                                                    }
                                                </div>

                                            </div> */}

                                            {type && (
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
                                            )}

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
                                                    label='Upload Product Gallery Image'
                                                    required
                                                    id='file'
                                                    type='file'
                                                    multiple
                                                    labelClass='mainLabel'
                                                    inputClass='mainInput'
                                                    name="image"
                                                    // value={formData.image}
                                                    onChange={filehandleChange}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <CustomInput
                                                    label='Upload Product Image'
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
                                                <CustomButton variant='primaryButton' text='Submit' type='submit' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <CustomModal show={showModal} close={() => { setShowModal(false) }} success heading='Product added Successfully.' />

            </DashboardLayout>
        </>
    );
};

