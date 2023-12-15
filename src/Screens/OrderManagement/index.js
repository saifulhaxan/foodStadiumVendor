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


import "./style.css";

export const OrderManagement = () => {
  const base_url = 'https://custom2.mystagingserver.site/food-stadium/public/'
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [inputValue, setInputValue] = useState('');


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
    item.title.toLowerCase().includes(inputValue.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filterData.slice(indexOfFirstItem, indexOfLastItem);


  const ProductData = () => {
    const LogoutData = localStorage.getItem('login');
    document.querySelector('.loaderBox').classList.remove("d-none");
    fetch('https://custom2.mystagingserver.site/food-stadium/public/api/vendor/product_listing',
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
        console.log(data.data)
        document.querySelector('.loaderBox').classList.add("d-none");
        setData(data.data);
      })
      .catch((error) => {
        document.querySelector('.loaderBox').classList.add("d-none");
        console.log(error)
      })

  }

  useEffect(() => {
    document.title = 'Food Stadium Vendor | Order Management';
    ProductData()

  }, []);

  const maleHeaders = [
    {
      key: "id",
      title: "Order No",
    },
    {
      key: "name",
      title: "User Name",
    },
    {
      key: "adress",
      title: "Adress",
    },
    {
      key: "email",
      title: "Email",
    },
    {
      key: "prouduct",
      title: "Products",
    },
    {
      key: "status",
      title: "Status",
    },
    {
      key: "created_at",
      title: "Created On",
    },
    // {
    //   key: "action",
    //   title: "Action",
    // }
  ];


  return (
    <>
      <DashboardLayout>
        <div className="container-fluid">
          <div className="row mb-3">
            <div className="col-12">
              <div className="dashCard">
                <div className="row mb-3 justify-content-between">
                  <div className="col-md-6 mb-2">
                    <h2 className="mainTitle">Order Management</h2>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div className="addUser">
                      {/* <CustomButton text="Add New Product" variant='primaryButton' onClick={hanldeRoute} /> */}
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
                        <tr>
                          <td>#1254</td>
                          <td>Jhon</td>
                          <td>112 street 5, calefornia, US</td>
                          <td>jhon@hotmail.com</td>
                          <td>Burger</td>
                          <td className="greenColor">Paid</td>
                          <td>11/24/2023</td>
                          
                        </tr>
                        <tr>
                          <td>#1254</td>
                          <td>Jhon</td>
                          <td>112 street 5, calefornia, US</td>
                          <td>jhon@hotmail.com</td>
                          <td>Burger</td>
                          <td className="greenColor">Paid</td>
                          <td>11/24/2023</td>
                          
                        </tr>
                        <tr>
                          <td>#1254</td>
                          <td>Jhon</td>
                          <td>112 street 5, calefornia, US</td>
                          <td>jhon@hotmail.com</td>
                          <td>Burger</td>
                          <td className="greenColor">Paid</td>
                          <td>11/24/2023</td>
                          
                        </tr>
                        <tr>
                          <td>#1254</td>
                          <td>Jhon</td>
                          <td>112 street 5, calefornia, US</td>
                          <td>jhon@hotmail.com</td>
                          <td>Burger</td>
                          <td className="greenColor">Paid</td>
                          <td>11/24/2023</td>
                          
                        </tr>
                        <tr>
                          <td>#1254</td>
                          <td>Jhon</td>
                          <td>112 street 5, calefornia, US</td>
                          <td>jhon@hotmail.com</td>
                          <td>Burger</td>
                          <td className="greenColor">Paid</td>
                          <td>11/24/2023</td>
                          {/* <td>
                             <Dropdown className="tableDropdown">
                                <Dropdown.Toggle variant="transparent" className="notButton classicToggle">
                                  <FontAwesomeIcon icon={faEllipsisV} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end" className="tableDropdownMenu"> 

                                  <Link to={`/order-management/order-detail/${4}`} className="tableAction"><FontAwesomeIcon icon={faEye} className="tableActionIcon" />View</Link>
                                 
                                 </Dropdown.Menu>
                              </Dropdown>
                          </td> */}
                        </tr>
                      </tbody>
                     {/* {/* <tbody>
                        {currentItems.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td><img src={base_url + item?.feature_image} className="avatarIcon" /></td>
                            <td className="text-capitalize">
                              {item?.title}
                            </td>
                            <td>{item?.product_price ? `$ ${item?.product_price}` : `$0`}</td>
                            <td>{item?.category?.name}</td>
                            <td>{item?.created_at}</td>
                            {/* <td className={item.status == 1 ? 'greenColor' : "redColor"}>{item.status == 1 ? 'Active' : "Inactive"}</td> */}
                            {/* <td> */}
                              {/* <Dropdown className="tableDropdown">
                                <Dropdown.Toggle variant="transparent" className="notButton classicToggle">
                                  <FontAwesomeIcon icon={faEllipsisV} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end" className="tableDropdownMenu"> */}

                                  {/* <Link to={`/order-management/order-detail/${item?.id}`} className="tableAction"><FontAwesomeIcon icon={faEye} className="tableActionIcon" />View</Link> */}
                                  {/* <Link to={`/order-management/edit-order/${item?.id}`} className="tableAction"><FontAwesomeIcon icon={faEdit} className="tableActionIcon" />Edit</Link> */}

                                {/* </Dropdown.Menu>
                              </Dropdown> */}
                            {/* </td>
                          </tr>
                        ))}
                      </tbody> */}
                    </CustomTable>
                    {/* <CustomPagination
                      itemsPerPage={itemsPerPage}
                      totalItems={data.length}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                    /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <CustomModal show={showModal} close={() => { setShowModal(false) }} action={inActive} heading='Are you sure you want to mark this user as inactive?' />
          <CustomModal show={showModal2} close={() => { setShowModal2(false) }} success heading='Marked as Inactive' />

          <CustomModal show={showModal3} close={() => { setShowModal3(false) }} action={ActiveMale} heading='Are you sure you want to mark this user as Active?' />
          <CustomModal show={showModal4} close={() => { setShowModal4(false) }} success heading='Marked as Active' />



        </div>
      </DashboardLayout>
    </>
  );
};
