// OrderHistory.jsx
export default function OrderHistory({ orders }) {

  const formatDate = (date) =>
    new Date(date).toLocaleDateString();

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "status delivered";

      case "pending":
        return "status pending";

      case "processing":
        return "status processing";

      case "cancelled":
        return "status cancelled";

      default:
        return "status";
    }
  };

  return (
    <>
      <style>{`
        .orders-card{
          background:#fff;
          border:1px solid #E1E8ED;
          border-radius:18px;
          padding:32px;
          margin-bottom:28px;
          box-shadow:0 4px 20px rgba(1,68,111,.06);
          overflow:hidden;
        }

        .orders-card h2{
          margin:0 0 24px;
          font-size:1.4rem;
          font-weight:700;
          color:#0B2A40;
          display:flex;
          align-items:center;
        }

        .orders-card h2::before{
          content:'';
          display:inline-block;
          width:26px;
          height:3px;
          border-radius:2px;
          background:#01446F;
          margin-right:12px;
        }

        .orders-table{
          width:100%;
          border-collapse:collapse;
          min-width:700px;
        }

        .orders-wrapper{
          overflow-x:auto;
          border:1px solid #E1E8ED;
          border-radius:12px;
        }

        .orders-table th{
          text-align:left;
          padding:14px 16px;
          background:#F8FAFB;
          font-size:.78rem;
          text-transform:uppercase;
          letter-spacing:.04em;
          color:#5C6B76;
          font-weight:700;
          border-bottom:1px solid #E1E8ED;
        }

        .orders-table td{
          padding:16px;
          border-bottom:1px solid #EDF1F4;
          font-size:.9rem;
          color:#0B2A40;
        }

        .orders-table tbody tr{
          transition:background .15s ease;
        }

        .orders-table tbody tr:hover{
          background:#F8FAFB;
        }

        .orders-table tr:last-child td{
          border-bottom:none;
        }

        .status{
          display:inline-block;
          padding:6px 14px;
          border-radius:50px;
          font-size:.78rem;
          font-weight:700;
          text-transform:capitalize;
        }

        .pending{
          background:#FDF3E2;
          color:#B7791F;
        }

        .processing{
          background:#E7F0F6;
          color:#01446F;
        }

        .delivered{
          background:#E6F6EE;
          color:#1E8E5A;
        }

        .cancelled{
          background:#FBEAE8;
          color:#C0392B;
        }

        .empty-orders{
          text-align:center;
          padding:60px 20px;
          color:#8B9AA3;
          border:1.5px dashed #E1E8ED;
          border-radius:12px;
        }
      `}</style>

      <section className="orders-card">

        <h2>Order History</h2>

        {orders.length === 0 ? (

          <div className="empty-orders">
            You haven't placed any orders yet.
          </div>

        ) : (

          <div className="orders-wrapper">

            <table className="orders-table">

              <thead>

                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>

              </thead>

              <tbody>

                {orders.map((order) => (

                  <tr key={order._id}>

                    <td>
                      #{order._id.slice(-8).toUpperCase()}
                    </td>

                    <td>
                      {formatDate(order.createdAt)}
                    </td>

                    <td>
                      <span
                        className={getStatusClass(order.status)}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>
                      ETB {order.totalPrice?.toLocaleString()}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </>
  );

}