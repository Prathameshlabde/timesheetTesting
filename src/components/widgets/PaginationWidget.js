import React from "react";
import PropTypes from "prop-types";

export const getPaginationButtonsRange = (
  totalPage,
  currentPage,
  maxNumbersOnLeftRight
) => {
  let start = currentPage - maxNumbersOnLeftRight,
    end = currentPage + maxNumbersOnLeftRight;

  if (currentPage < maxNumbersOnLeftRight + 1) {
    start = 1;
    if (totalPage < maxNumbersOnLeftRight * 2 + 1) {
      end = totalPage;
    } else {
      end = maxNumbersOnLeftRight * 2 + 1;
    }
  }
  if (currentPage > totalPage - maxNumbersOnLeftRight) {
    if (totalPage - maxNumbersOnLeftRight * 2 < 1) {
      start = 1;
    } else {
      start = totalPage - maxNumbersOnLeftRight * 2;
    }
    end = totalPage;
  }

  return {
    start: start,
    end: end
  };
};

export default class PaginationWidget extends React.Component {
  static propTypes = {
    totalPage: PropTypes.number,
    currentPage: PropTypes.number,
    maxNumbersOnLeftRight: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    style: PropTypes.object
  };

  onPageChanged(pageNumber, totalPage, action) {
    const { onChange } = this.props;
    pageNumber = parseInt(pageNumber, 10);
    if (action === "prev" && pageNumber - 1 > 0) {
      pageNumber -= 1;
    } else if (action === "next" && pageNumber + 1 <= totalPage) {
      pageNumber += 1;
    }
    return () => {
      onChange(pageNumber);
    };
  }

  render() {
    const { totalPage, currentPage, maxNumbersOnLeftRight } = this.props;

    // console.log("currentPage :-", currentPage);

    let li = [];
    const limits = getPaginationButtonsRange(
        totalPage,
        currentPage,
        maxNumbersOnLeftRight
      ),
      start = limits.start,
      end = limits.end;

    if (totalPage > 1 && start > 0 && end > 0) {
      for (let i = start; i <= end; i++) {
        if (i === start && currentPage !== start) {
          li.push(
            <li key="Prev">
              <button
                className="prev-pagination-link"
                onClick={this.onPageChanged(
                  this.props.currentPage,
                  totalPage,
                  "prev"
                )}
              >
                &lt;&lt;
              </button>
            </li>
          );
        }

        if (this.props.currentPage === i) {
          li.push(
            <li key={i} className="active-currentPage">
              <button
                style={{
                  margin: "4px"
                }}
              >
                {i}
              </button>
            </li>
          );
        } else {
          let link = "pagination-link-" + i;
          li.push(
            <li key={i}>
              <button
                className={link}
                onClick={this.onPageChanged(i, totalPage, "page")}
                style={{
                  margin: "4px"
                }}
              >
                {i}
              </button>
            </li>
          );
        }

        if (i === end && currentPage !== end) {
          li.push(
            <li key="Next">
              <button
                className="next-pagination-link"
                onClick={this.onPageChanged(
                  this.props.currentPage,
                  totalPage,
                  "next"
                )}
              >
                &gt;&gt;
              </button>
            </li>
          );
        }
      }
    }

    return <ul className="pagination">{li}</ul>;
  }
}
