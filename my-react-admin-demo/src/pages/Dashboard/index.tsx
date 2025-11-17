import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import useAuthStore from "@/store/useAuthStore";

/**
 * 仪表盘页面
 */
function Dashboard() {
  const { currentUser } = useAuthStore();
  return (
    <div>
      {/* 欢迎信息 */}
      <Card style={{ marginBottom: 24 }}>
        <h2>欢迎回来，{currentUser?.name}!</h2>
        <p style={{ color: "#999" }}>
          这是你的工作台，你可以在这里查看系统概览和重要数据。
        </p>
      </Card>

      {/* 数据统计卡片 */}
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总订阅用户数"
              value={1128}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="点击量"
              value={26800000}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="总收益"
              value={93256}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#cf1322" }}
              precision={2}
              suffix="元"
            />
          </Card>
        </Col>
      </Row>

      <Card title="快捷操作" style={{ marginTop: 24 }}>
        <p>这里可以添加常用功能快捷入口</p>
      </Card>
    </div>
  );
}

export default Dashboard;
