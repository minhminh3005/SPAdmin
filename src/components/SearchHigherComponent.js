import React, { useEffect, useState } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { Loader } from "semantic-ui-react";
import { post } from "../utils/api";
import CustomPagination from "./CustomPagination";
import Toolbar from "./Toolbar";

function SearchHigherComponent(Component, props) {
  function WrappedComponent() {
    let { id } = useParams();

    const [data, setData] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState(
      props.status ? { status: props.status } : {}
    );
    const [isReload, setIsReload] = useState(false);

    if (!id) {
      id = "";
    }

    useEffect(() => {
      setData(null);
      post(
        props.endpoint + id,
        {
          page,
          pageSize,
          search: "",
          orderBy: "",
          filters,
        },
        (data) => {
          setData(data);
        }
      );

    }, [filters, id, page, pageSize, isReload]);

    const _handleChangePageSize = (e, { value }) => {
      setPageSize(value);
      setPage(1);
    };

    const _handleChangePage = (e, { activePage }) => {
      setPage(activePage);
    };

    const _handleSearch = (filters) => {
      setPage(1);
      setFilters(filters);
    };

    return (
      <>
        <Toolbar
          filterBy={props.filterBy}
          component={props.component}
          onSearch={_handleSearch}
          defaultStatus={props.status}
          exportLink={props.exportLink}
        />
        {data ? (
          <Component
            {...props}
            data={data}
            onReload={() => setIsReload(!isReload)}
          />
        ) : (
          <Loader active />
        )}
        <CustomPagination
          data={data}
          changePageSize={_handleChangePageSize}
          changePage={_handleChangePage}
        />
      </>
    );
  }
  return WrappedComponent;
}

export default SearchHigherComponent;
