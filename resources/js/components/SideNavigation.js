import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

export default function SideNavigation(){
    return(<>
        <div className="scrollbar-sidebar">
              <div className="app-sidebar__inner">
                <ul className="vertical-nav-menu">
                  <li className="app-sidebar__heading">Dashboard</li>
                  <li>
                    <Link to="/app">
                        <i className="metismenu-icon pe-7s-rocket" />
                        Dashboard
                    </Link>
                  </li>
                  <li className="app-sidebar__heading">Manage Links</li>
                  <li>
                    <a href="#">
                        <i className="metismenu-icon pe-7s-rocket" />
                        Create New Links
                    </a>
                    <ul className="mm-collapse mm-show" style={{}}>
                        <li>
                            <Link to="/app/links/product/new">
                                <i className="metismenu-icon" />
                                Product
                            </Link>
                        </li>
                        <li>
                            <Link to="/app/links/collection/new">
                                <i className="metismenu-icon" />
                                Collection
                            </Link>
                        </li>
                        <li>
                            <Link to="/app/links/custom/new">
                                <i className="metismenu-icon" />
                                Custom
                            </Link>
                        </li>
                    </ul>
                  </li>
                  <li>
                    <Link to="/app/links/all">
                        <i className="metismenu-icon pe-7s-rocket" />
                        View All Links
                    </Link>
                  </li>
                  
                  
                </ul>
              </div>
            </div>
    </>)
}