import { Table } from "antd";
import type { ColumnType } from "antd/es/table";
import { useMemo, useState } from "react";
import type { TableCommonProps } from "../../common/types/common";
import "./style.scss";
import { Pagination } from "../PaginationCommon/paginationCommon";

interface CommonTableProps {
  header: TableCommonProps[];
  body: any[] | [];
  className?: string;
  filter?: any;
  hasPagination?: boolean;
  pageSize?: number;
  loading?: boolean;
}

export const CommonTable = ({
  header,
  body,
  className = "",
  filter,
  hasPagination = false,
  pageSize = 10,
  loading = false,
}: CommonTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!filter) return body;

    return body.filter((item) => {
      return Object.keys(filter).every((key) => {
        if (!filter[key]) return true;

        const itemValue = item[key];
        const filterValue = filter[key];

        if (typeof itemValue === "string") {
          return itemValue.toLowerCase().includes(filterValue.toLowerCase());
        }

        return itemValue === filterValue;
      });
    });
  }, [body, filter]);

  const paginatedData = useMemo(() => {
    if (!hasPagination) return filteredData;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData?.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize, hasPagination]);

  const totalPages = Math.ceil(filteredData?.length / pageSize);

  const columns: ColumnType<any>[] = useMemo(() => {
    return header.map((col) => ({
      title: col.label,
      dataIndex: col.value || col.label.toLowerCase(),
      key: col.key,
      className: col.className || "",
      render: col.render
        ? (text: any, record: any, index: number) => col.render!(text, record)
        : undefined,
    }));
  }, [header]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={`common__table ${className}`}>
      <Table
        columns={columns}
        dataSource={paginatedData}
        pagination={false}
        loading={loading}
        rowKey={(record, index) => record.key || index}
        bordered
        size="middle"
        scroll={{ x: "max-content" }}
      />

      {hasPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};
