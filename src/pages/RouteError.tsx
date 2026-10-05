import { isRouteErrorResponse, useRouteError } from 'react-router';

export default function RouteError() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Đã có lỗi xảy ra.';

  return (
    <main id="main" className="content">
      <div className="empty card" role="alert">
        <h1>Không tải được trang này</h1>
        <p className="lead">{message}</p>
        <button type="button" className="btn btn-primary" onClick={() => location.reload()}>Tải lại trang</button>
      </div>
    </main>
  );
}
