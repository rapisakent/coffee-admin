import { Package, Wrench } from 'lucide-react';
import { api } from '../../api';
import { useQuery } from '../../api/useQuery';
import { LoadState } from '../../components/LoadState';
import { PageHeader } from '../../components/PageHeader';
import { CardHead } from '../../components/ui';
import { DonutChart } from './DonutChart';
import { KpiCards } from './KpiCards';
import { RecentOrders, TopProducts, UpcomingInstalls, Watchlist } from './ListCards';
import { RevenueChart } from './RevenueChart';

export default function DashboardPage() {
  const { status, data, error, reload } = useQuery(api.dashboard.get);

  return (
    <main id="main" className="content">
      <PageHeader
        eyebrow="Tổng quan"
        title="Dashboard điều hành"
        lead="Bức tranh tổng thể về doanh thu, đơn hàng, kho và dịch vụ sau bán."
      />

      {!data ? (
        <LoadState status={status} error={error} onReload={reload} />
      ) : (
        <>
          <KpiCards monthly={data.monthly} newCustomers={data.newCustomers} />

          <div className="row row-charts">
            <section className="card">
              <CardHead title="Doanh thu & đơn hàng theo tháng" sub={`${data.monthly.length} tháng gần nhất`} />
              <RevenueChart data={data.monthly} />
            </section>
            <section className="card">
              <CardHead title="Doanh thu theo nhóm" sub="Tỷ trọng theo loại sản phẩm" />
              <DonutChart data={data.revenueByGroup} />
            </section>
          </div>

          <div className="row row-3">
            <Watchlist title="Tồn kho thấp" icon={Package} to="/ton-kho" items={data.lowStock} />
            <Watchlist title="Máy chờ lắp đặt" icon={Wrench} to="/lap-dat" items={data.pendingInstalls} />
            <Watchlist title="Máy đang bảo hành / sửa" icon={Wrench} to="/bao-hanh" items={data.inRepair} />
          </div>

          <div className="row row-lists">
            <RecentOrders orders={data.recentOrders} />
            <TopProducts products={data.topProducts} />
          </div>

          <UpcomingInstalls installs={data.upcomingInstalls} />
        </>
      )}
    </main>
  );
}
