import React, {useState, useEffect} from 'react';
import {TitleBar, useRoutePropagation} from '@shopify/app-bridge-react';
import {useLocation} from 'react-router-dom';
import axios from 'axios';

export default function ShowAllLinks(){
    let location = useLocation();
    console.log(location)
    const [linksData, setLinksData] = useState([]);

    useRoutePropagation(location);
    useEffect(() => {
        axios.get('/api/links')
        .then(function (response) {
            setLinksData(response.data)
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }, []);

    function deleteLink(id){
        axios.delete(`/api/links/${id}`)
        .then(function (response) {
            if(response.data == "Link Deleted") {
                let newData = linksData.filter((item) => item.id != id );
                setLinksData(newData);
            }
            
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    
    return(<>
        <TitleBar title="Show All Links" />
        <div className="app-page-title">
            <div className="page-title-wrapper">
                <div className="page-title-heading">
                    <div className="page-title-icon">
                        <i className="pe-7s-drawer icon-gradient bg-happy-itmeo">
                        </i>
                    </div>
                    <div>View All Links
                        <div className="page-title-subheading">See all the links including custom, prodcut, and collection links.
                        </div>
                    </div>
                </div>
                <div className="page-title-actions">
                    <button type="button" data-toggle="tooltip" title="" data-placement="bottom" className="btn-shadow mr-3 btn btn-dark" data-original-title="Example Tooltip">
                        <i className="fa fa-star"></i>
                    </button>
                    <div className="d-inline-block dropdown">
                        <button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="btn-shadow dropdown-toggle btn btn-info">
                            <span className="btn-icon-wrapper pr-2 opacity-7">
                                <i className="fa fa-business-time fa-w-20"></i>
                            </span>
                            Buttons
                        </button>
                        <div role="menu" aria-hidden="true" className="dropdown-menu dropdown-menu-right">
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <a href="#" className="nav-link">
                                        <i className="nav-link-icon lnr-inbox"></i>
                                        <span>
                                            Inbox
                                        </span>
                                        <div className="ml-auto badge badge-pill badge-secondary">86</div>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="#" className="nav-link">
                                        <i className="nav-link-icon lnr-book"></i>
                                        <span>
                                            Book
                                        </span>
                                        <div className="ml-auto badge badge-pill badge-danger">5</div>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href="#" className="nav-link">
                                        <i className="nav-link-icon lnr-picture"></i>
                                        <span>
                                            Picture
                                        </span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a disabled="" href="#" className="nav-link disabled">
                                        <i className="nav-link-icon lnr-file-empty"></i>
                                        <span>
                                            File Disabled
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>    </div>
        </div>
        <div className="row">
            <div className="col-lg-12">
                <div className="main-card mb-3 card">
                    <div className="card-body"><h5 className="card-title">Links</h5>
                        <table className="mb-0 table table-hover">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Link Type</th>
                                <th>Discount Code</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    linksData.map((item) => {
                                        let directory = '';
                                        switch(item.link_type){
                                            case 'product':
                                                directory = 'products';
                                            break;
                                            case 'collection':
                                                directory = 'collections';
                                                break;
                                            default:
                                                directory = 'custom' 
                                        }
                                        return(
                                            <tr key={item.id}>
                                                <th scope="row">{item.id}</th>
                                                <td>{item.original_content_title}</td>
                                                <td><div className={`mb-2 mr-2 badge ${item.link_type == 'custom' ? 'badge-warning' : 'badge-primary'}`}>{item.link_type}</div></td>
                                                <td>{item.discount_code}</td>
                                                <td>
                                                    <a href={`/app/links/${directory}/${item.id}/edit`} className="mb-2 mr-2 btn btn-success">
                                                        <i className="pe-7s-pen"> </i> Edit
                                                    </a>
                                                    <button onClick={() => deleteLink(item.id)} className="mb-2 mr-2 btn btn-danger">
                                                    <i className="pe-7s-trash"> </i> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                
                            
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
    </>)
}