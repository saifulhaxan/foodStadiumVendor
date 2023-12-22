import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "../../Components/Layout/DashboardLayout";
import BackButton from "../../Components/BackButton";
import CustomModal from "../../Components/CustomModal";
import CustomButton from "../../Components/CustomButton";

export const ProductDetails = () => {

    const { id } = useParams();

    const base_url = 'https://custom2.mystagingserver.site/food-stadium/public/'

    const [data, setData] = useState({});

    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    const [showModal4, setShowModal4] = useState(false);
    const [message, setMessage] = useState(false)


    const inActive = () => {
        setShowModal(false)
        setShowModal2(true)
    }
    const Active = () => {
        setShowModal3(false)
        setShowModal4(true)
    }

    useEffect(() => {
        const LogoutData = localStorage.getItem('login');
        document.title = 'Food Stadium Admin | Product Detail';
        document.querySelector('.loaderBox').classList.remove("d-none");
        fetch(`https://custom2.mystagingserver.site/food-stadium/public/api/vendor/view_product/${id}`,
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

                setData(data?.data)

            })
            .catch((error) => {
                document.querySelector('.loaderBox').classList.add("d-none");
                console.log(error);
            })
    }, [id]);
    console.log(data)

    return (
        <>
            <DashboardLayout>
                <div className="dashCard mb-4">
                    <div className="row mb-3">
                        <div className="col-12 mb-2">
                            <h2 className="mainTitle">
                                <BackButton />
                                Product Details
                            </h2>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-12">
                            {/* <div className="row mb-3 justify-content-end">
                <div className="col-lg-4 text-end order-1 order-lg-2 mb-3">
                  <button onClick={() => {
                    data?.status ? setShowModal(true) : setShowModal3(true)
                  }} className="notButton primaryColor fw-bold text-decoration-underline">Mark as {data?.status ? 'Inactive' : 'Active'}</button>
                  <span className={`statusBadge ${data?.status == 1 ? 'statusBadgeActive' : 'statusBadgeInactive'}`}>{data?.status == 1 ? 'Active' : 'Inactive'}</span>
                </div>
              </div> */}


                            <div className="row">
                                <div className="col-md-6 mb-4">

                                    <div className="productImage">
                                        {/* {data?.product_images && data?.product_images.length > 0 ?
                                            (
                                                <img src={base_url + data?.product_images[0]?.image} />
                                            ) : (
                                                <img src={base_url + data?.product_images?.image} />
                                            )} */}
                                        <img src={base_url + data?.feature_image} />
                                    </div>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <div className="productInfo">
                                        <h3 className="text-capitalize">{data?.title}</h3>
                                        <h6><span className="font-weight-bold">Price:</span><span className="text-success">{` $ ${data?.product_price}`}</span></h6>
                                        <p>{data?.description}</p>
                                        <p><span className="font-weight-bold">Category:</span> <span>{data?.category?.name}</span></p>
                                        {data?.dietary?.name && (
                                            <p><span className="font-weight-bold">Dietary:</span> <span>{data?.dietary?.name}</span></p>
                                        )}

                                        {data?.menu?.name && (
                                            <p><span className="font-weight-bold">Menu:</span> <span>{data?.menu?.name}</span></p>
                                        )}


                                    </div>
                                </div>
                            </div>
                            {/* <div className="row">
                                <div className="col-md-12 mb-4">
                                    <h2 className="mainTitle">
                                        Customize Products
                                    </h2>
                                </div>
                                {data?.customize_menu && data?.customize_menu.map((item) =>
                                    item && (
                                        <div className="customDataItem col-md-4 mb-4">
                                            <div className="productAdonItem">
                                                <div className="productImageIcon">
                                                    <img src={base_url + item?.item_pic} />
                                                </div>
                                                <div className="addonDesc">
                                                    <h5 className="text-capitalize">{item?.item_name}</h5>
                                                    <p>{`$ ${item?.item_price}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )
                                }
                            </div> */}
                            {/* variations  */}
                            {
                                data?.variation && data?.variation?.map((item, index) => (
                                    <div className="row">
                                        <div className="col-md-12 mb-4">
                                            <h2 className="mainTitle text-capitalize">
                                                {`${item?.name} Variation`}
                                            </h2>
                                        </div>
                                        {item?.variation_items && item?.variation_items.map((variationItem) =>
                                            item && (
                                                <div className="customDataItem col-md-4 mb-4">
                                                    <div className="productAdonItem">
                                                        <div className="productImageIcon">
                                                            <img src={base_url + variationItem?.image} />
                                                        </div>
                                                        <div className="addonDesc">
                                                            <h5 className="text-capitalize">{variationItem?.title}</h5>
                                                            <p>{`$ ${variationItem?.price}`}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )
                                        }
                                    </div>
                                ))
                            }

                        </div>
                    </div>
                </div>

                <CustomModal show={showModal} close={() => { setShowModal(false) }} action={inActive} heading='Are you sure you want to mark this user as inactive?' />
                <CustomModal show={showModal2} close={() => { setShowModal2(false) }} success heading='Marked as Inactive' />

                <CustomModal show={showModal3} close={() => { setShowModal3(false) }} action={Active} heading='Are you sure you want to mark this user as Active?' />
                <CustomModal show={showModal4} close={() => { setShowModal4(false) }} success heading='Marked as Active' />
            </DashboardLayout>
        </>
    );
};

