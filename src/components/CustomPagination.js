import React from "react";
import { Dropdown, Grid, Pagination, Segment } from "semantic-ui-react";

function CustomPagination({ data, changePage, changePageSize }) {
  return (
    data && (
      <Segment vertical>
        <Grid columns="equal">
          <Grid.Column textAlign="left">
            {data.pageCount > 1 && (
              <Pagination
                totalPages={data.pageCount}
                onPageChange={changePage}
                activePage={data.page}
              />
            )}
          </Grid.Column>
          <Grid.Column textAlign="right">
            <Dropdown
              options={[
                {
                  key: 1,
                  value: 10,
                  text: 10,
                },
                {
                  key: 2,
                  value: 20,
                  text: 20,
                },
                {
                  key: 3,
                  value: 50,
                  text: 50,
                },
                {
                  key: 4,
                  value: 100,
                  text: 100,
                },
              ]}
              selection
              search
              value={data.pageSize}
              compact
              onChange={changePageSize}
            />
          </Grid.Column>
        </Grid>
      </Segment>
    )
  );
}

export default CustomPagination;
