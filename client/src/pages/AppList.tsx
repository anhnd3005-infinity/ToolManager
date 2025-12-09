import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, Card, Row, Col, Tooltip, DatePicker, Drawer, Descriptions } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { PortfolioApp } from '../types';
import { getApps, createApp, updateApp, deleteApp } from '../services/api';
import dayjs from 'dayjs';

const { Option } = Select;

const AppList: React.FC = () => {
  const [apps, setApps] = useState<PortfolioApp[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [editingApp, setEditingApp] = useState<PortfolioApp | null>(null);
  const [viewApp, setViewApp] = useState<PortfolioApp | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Filters State
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [storeFilter, setStoreFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const data = await getApps();
      setApps(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleAdd = () => {
    setEditingApp(null);
    form.resetFields();
    setIsDrawerVisible(true);
  };

  const handleEdit = (record: PortfolioApp) => {
    setEditingApp(record);
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? dayjs(record.startDate) : null,
      releaseDate: record.releaseDate ? dayjs(record.releaseDate) : null,
      monthOrder: record.monthOrder ? dayjs(record.monthOrder, 'YYYY-MM') : null,
      retentionD1: record.retention?.d1,
      retentionD7: record.retention?.d7,
      retentionD30: record.retention?.d30,
    });
    setIsDrawerVisible(true);
  };

  const handleView = (record: PortfolioApp) => {
    setViewApp(record);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this app?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        await deleteApp(id);
        fetchApps();
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Transform Data
      const payload: any = {
        ...values,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        releaseDate: values.releaseDate ? values.releaseDate.format('YYYY-MM-DD') : null,
        monthOrder: values.monthOrder ? values.monthOrder.format('YYYY-MM') : null,
      };
      
      // Only add retention if at least one value exists
      if (values.retentionD1 || values.retentionD7 || values.retentionD30) {
        payload.retention = {
          d1: values.retentionD1 ? Number(values.retentionD1) : undefined,
          d7: values.retentionD7 ? Number(values.retentionD7) : undefined,
          d30: values.retentionD30 ? Number(values.retentionD30) : undefined,
        };
      }
      
      if (values.volume) {
        payload.volume = Number(values.volume);
      }
      
      delete payload.retentionD1;
      delete payload.retentionD7;
      delete payload.retentionD30;
      
      console.log('Payload to send:', JSON.stringify(payload, null, 2));

      setLoading(true);
      if (editingApp) {
        await updateApp(editingApp.id, payload);
        Modal.success({ title: 'Success', content: 'App updated successfully!' });
      } else {
        const result = await createApp(payload);
        console.log('Created app:', result);
        Modal.success({ title: 'Success', content: 'App created successfully!' });
      }
      setIsDrawerVisible(false);
      form.resetFields();
      await fetchApps();
    } catch (error: any) {
      console.error('Submit error:', error);
      const errorMessage = error.response?.data?.error || error.message || error.toString();
      console.error('Full error:', errorMessage);
      Modal.error({
        title: 'Error',
        content: errorMessage,
        width: 500,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchText.toLowerCase()) || 
                          app.owner?.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter.length === 0 || (app.status && statusFilter.includes(app.status));
    const matchesStore = storeFilter.length === 0 || (app.store && storeFilter.includes(app.store));
    const matchesPriority = priorityFilter.length === 0 || (app.priority && priorityFilter.includes(app.priority));
    
    return matchesSearch && matchesStatus && matchesStore && matchesPriority;
  });

  const columns: ColumnsType<PortfolioApp> = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id', 
      width: 60,
      sorter: (a, b) => a.id - b.id,
    },
    { 
      title: 'App Details', 
      dataIndex: 'name', 
      key: 'name',
      width: 250,
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>{text}</span>
          <Space size="small" style={{ fontSize: 12, color: '#888' }}>
            <span>{record.store}</span>
            {record.category && <span>• {record.category}</span>}
          </Space>
          {record.link && <a href={record.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>Store Link</a>}
          {record.referenceApp && (
            <Tooltip title={record.referenceApp}>
              <Tag color="blue" style={{ fontSize: 11, marginTop: 4 }}>📱 Reference</Tag>
            </Tooltip>
          )}
        </Space>
      )
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      width: 120,
      render: (status: string) => {
        let color = 'default';
        if (status === 'Live') color = 'success';
        if (status === 'Research') color = 'processing';
        if (status === 'Develop') color = 'warning';
        if (status === 'Optimize') color = 'purple';
        if (status === 'Stop') color = 'error';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    { 
      title: 'Info', 
      key: 'info',
      render: (_, record) => (
        <Space direction="vertical" size="small" style={{ fontSize: 12 }}>
          <div><span style={{ fontWeight: 500 }}>Type:</span> {record.type || '-'}</div>
          <div><span style={{ fontWeight: 500 }}>Executor:</span> {record.executor || '-'}</div>
          <div><span style={{ fontWeight: 500 }}>Priority:</span> <Tag color={record.priority === 'High' ? 'red' : record.priority === 'Medium' ? 'orange' : 'green'}>{record.priority || 'N/A'}</Tag></div>
        </Space>
      )
    },
    {
       title: 'Dates',
       key: 'dates',
       render: (_, record) => (
         <Space direction="vertical" size="small" style={{ fontSize: 12 }}>
           {record.startDate && <div>Start: {dayjs(record.startDate).format('DD/MM/YYYY')}</div>}
           {record.releaseDate && <div>Rel: {dayjs(record.releaseDate).format('DD/MM/YYYY')}</div>}
         </Space>
       )
    },
    { 
      title: 'Reference', 
      key: 'reference',
      width: 120,
      render: (_, record) => (
        record.referenceApp ? (
          <Tooltip title={record.referenceApp}>
            <Button 
              type="link" 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => {
                Modal.info({
                  title: 'Prefer App (Reference)',
                  content: <div style={{ whiteSpace: 'pre-wrap', marginTop: 16 }}>{record.referenceApp}</div>,
                  width: 600,
                });
              }}
            >
              View
            </Button>
          </Tooltip>
        ) : <span style={{ color: '#ccc' }}>-</span>
      )
    },
    { 
      title: 'Owner', 
      dataIndex: 'owner', 
      key: 'owner',
      width: 120,
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View">
            <Button size="small" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        {/* Header Actions */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }} align="middle">
            <Col flex="auto">
               <Space wrap>
                 <Input 
                   placeholder="Search..." 
                   prefix={<SearchOutlined />} 
                   style={{ width: 200 }}
                   onChange={e => setSearchText(e.target.value)}
                 />
                 <Select 
                   mode="multiple" 
                   placeholder="Status" 
                   style={{ minWidth: 150 }} 
                   onChange={setStatusFilter}
                   allowClear
                 >
                    {['Research', 'Idea', 'Develop', 'Ready', 'Live', 'Optimize', 'Pause', 'Stop'].map(s => <Option key={s} value={s}>{s}</Option>)}
                 </Select>
                 <Select 
                   mode="multiple" 
                   placeholder="Store" 
                   style={{ minWidth: 150 }} 
                   onChange={setStoreFilter}
                   allowClear
                 >
                    {['Google Play', 'App Store'].map(s => <Option key={s} value={s}>{s}</Option>)}
                 </Select>
                  <Select 
                   mode="multiple" 
                   placeholder="Priority" 
                   style={{ minWidth: 150 }} 
                   onChange={setPriorityFilter}
                   allowClear
                 >
                    {['High', 'Medium', 'Low'].map(s => <Option key={s} value={s}>{s}</Option>)}
                 </Select>
               </Space>
            </Col>
            <Col>
               <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
                 Add App
               </Button>
            </Col>
        </Row>
        
        <Table 
          columns={columns} 
          dataSource={filteredApps} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Edit/Create Drawer */}
      <Drawer
        title={editingApp ? "Edit App" : "New App"}
        width={720}
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
        extra={
          <Space>
            <Button onClick={() => setIsDrawerVisible(false)}>Cancel</Button>
            <Button onClick={handleSubmit} type="primary">
              {editingApp ? "Update" : "Create"}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" requiredMark>
          <Row gutter={16}>
             <Col span={24}><div style={{ fontWeight: 'bold', marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>General Info</div></Col>
             <Col span={12}>
              <Form.Item name="name" label="App Name" rules={[{ required: true }]}>
                <Input placeholder="e.g. Photo Editor" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="link" label="Store/Design Link">
                <Input placeholder="URL" />
              </Form.Item>
            </Col>
            <Col span={24}>
               <Form.Item name="referenceApp" label="Prefer App (Reference)">
                <Input.TextArea rows={2} placeholder="List of reference apps or benchmarks..." />
              </Form.Item>
            </Col>
             <Col span={8}>
              <Form.Item name="store" label="Store">
                <Select placeholder="Select Store">
                  <Option value="Google Play">Google Play</Option>
                  <Option value="App Store">App Store</Option>
                </Select>
              </Form.Item>
            </Col>
             <Col span={8}>
              <Form.Item name="category" label="Category">
                <Select placeholder="Select Category">
                  <Option value="Entertainment">Entertainment</Option>
                  <Option value="Tools">Tools</Option>
                  <Option value="Productivity">Productivity</Option>
                </Select>
              </Form.Item>
            </Col>
             <Col span={8}>
              <Form.Item name="group" label="Group/Campaign">
                <Input placeholder="e.g. The Sun" />
              </Form.Item>
            </Col>

            <Col span={24}><div style={{ fontWeight: 'bold', marginBottom: 16, marginTop: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>Execution Plan</div></Col>
            <Col span={8}>
              <Form.Item name="status" label="Status">
                 <Select>
                    {['Research', 'Idea', 'Develop', 'Ready', 'Live', 'Optimize', 'Pause', 'Stop'].map(s => <Option key={s} value={s}>{s}</Option>)}
                 </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="priority" label="Priority">
                 <Select>
                  <Option value="High">High</Option>
                  <Option value="Medium">Medium</Option>
                  <Option value="Low">Low</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="type" label="Type">
                 <Select placeholder="App Type">
                  <Option value="New App">New App</Option>
                  <Option value="Reskin">Reskin</Option>
                  <Option value="Optimize">Optimize</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="executor" label="Executor">
                 <Select placeholder="Who executes?">
                  <Option value="Inhouse">Inhouse</Option>
                  <Option value="Partner">Partner</Option>
                  <Option value="Outsource">Outsource</Option>
                </Select>
              </Form.Item>
            </Col>
             <Col span={8}>
              <Form.Item name="owner" label="Product Owner">
                <Input />
              </Form.Item>
            </Col>
             <Col span={8}>
               <Form.Item name="monthOrder" label="Month Order">
                 <DatePicker picker="month" format="MM/YYYY" style={{ width: '100%' }} />
               </Form.Item>
             </Col>
             <Col span={12}>
               <Form.Item name="startDate" label="Start Date">
                 <DatePicker style={{ width: '100%' }} />
               </Form.Item>
             </Col>
             <Col span={12}>
               <Form.Item name="releaseDate" label="Release Date">
                 <DatePicker style={{ width: '100%' }} />
               </Form.Item>
             </Col>

            <Col span={24}><div style={{ fontWeight: 'bold', marginBottom: 16, marginTop: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>Performance & Strategy</div></Col>
            <Col span={8}>
               <Form.Item name="retentionD1" label="Retention D1 (%)">
                 <Input type="number" suffix="%" />
               </Form.Item>
            </Col>
            <Col span={8}>
               <Form.Item name="retentionD7" label="Retention D7 (%)">
                 <Input type="number" suffix="%" />
               </Form.Item>
            </Col>
             <Col span={8}>
               <Form.Item name="retentionD30" label="Retention D30 (%)">
                 <Input type="number" suffix="%" />
               </Form.Item>
            </Col>
            <Col span={12}>
               <Form.Item name="volume" label="Volume/Month">
                 <Input type="number" />
               </Form.Item>
            </Col>
             <Col span={24}>
               <Form.Item name="strategy" label="Strategy">
                 <Input.TextArea rows={3} />
               </Form.Item>
            </Col>
            <Col span={24}>
               <Form.Item name="requestInfo" label="MKT/PO Request">
                 <Input.TextArea rows={3} />
               </Form.Item>
            </Col>
            <Col span={24}>
               <Form.Item name="updateIssue" label="Issues / Blockers">
                 <Input.TextArea rows={3} />
               </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>

      {/* View Details Modal */}
      <Modal
         title="App Details"
         open={!!viewApp}
         onCancel={() => setViewApp(null)}
         footer={[<Button key="close" onClick={() => setViewApp(null)}>Close</Button>]}
         width={800}
      >
        {viewApp && (
           <Descriptions bordered column={2}>
             <Descriptions.Item label="App Name">{viewApp.name}</Descriptions.Item>
             <Descriptions.Item label="Store">{viewApp.store}</Descriptions.Item>
             <Descriptions.Item label="Status"><Tag>{viewApp.status}</Tag></Descriptions.Item>
             <Descriptions.Item label="Priority"><Tag>{viewApp.priority}</Tag></Descriptions.Item>
             <Descriptions.Item label="Type">{viewApp.type}</Descriptions.Item>
             <Descriptions.Item label="Executor">{viewApp.executor}</Descriptions.Item>
             <Descriptions.Item label="Owner">{viewApp.owner}</Descriptions.Item>
             <Descriptions.Item label="Category">{viewApp.category}</Descriptions.Item>
             <Descriptions.Item label="Start Date">{viewApp.startDate ? dayjs(viewApp.startDate).format('DD/MM/YYYY') : '-'}</Descriptions.Item>
             <Descriptions.Item label="Release Date">{viewApp.releaseDate ? dayjs(viewApp.releaseDate).format('DD/MM/YYYY') : '-'}</Descriptions.Item>
             <Descriptions.Item label="Retention" span={2}>
               D1: {viewApp.retention?.d1}% | D7: {viewApp.retention?.d7}% | D30: {viewApp.retention?.d30}%
             </Descriptions.Item>
             <Descriptions.Item label="Prefer App (Reference)" span={2}>
               {viewApp.referenceApp || '-'}
             </Descriptions.Item>
             <Descriptions.Item label="Strategy" span={2}>{viewApp.strategy}</Descriptions.Item>
             <Descriptions.Item label="MKT Request" span={2}>{viewApp.requestInfo}</Descriptions.Item>
             <Descriptions.Item label="Issues" span={2}>{viewApp.updateIssue}</Descriptions.Item>
           </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default AppList;
