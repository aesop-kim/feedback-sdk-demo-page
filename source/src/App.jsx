import { useMemo, useState } from 'react';
import Button from '@lattice-im/design-system/components/buttons/Button/Button';
import Badge from '@lattice-im/design-system/components/data-display/Badge/Badge';
import DataGrid from '@lattice-im/design-system/components/data-display/DataGrid/DataGrid';
import DataGridFloatingActionBar from '@lattice-im/design-system/components/data-display/DataGrid/DataGridFloatingActionBar/DataGridFloatingActionBar';
import Icon from '@lattice-im/design-system/components/data-display/Icon/Icon';
import InitialAvatar from '@lattice-im/design-system/components/data-display/InitialAvatar/InitialAvatar';
import DataGridLayout from '@lattice-im/design-system/components/layouts/DataGridLayout/DataGridLayout';
import DataGridSection from '@lattice-im/design-system/components/layouts/DataGridSection/DataGridSection';

const CUSTOMERS = ['한빛상사', '세라트젠', '오름기획', '누리테크', '다온물산', '가람전자', '미르건설', '새솔유통'];
const MENUS = [
  { icon: 'House', text: '홈' },
  { icon: 'FileText', text: '전체 계약서' },
  { icon: 'FolderSimple', text: '프로젝트' },
  { icon: 'UsersThree', text: '고객' },
  { icon: 'PenNib', text: '전자서명' },
];
const BROKEN_LIMIT = 100;

const createContracts = () =>
  Array.from({ length: 23 }, (_, index) => ({
    id: `DOC-${1001 + index}`,
    title: `${CUSTOMERS[index % CUSTOMERS.length]} 서비스 이용 계약서`,
    customer: CUSTOMERS[index % CUSTOMERS.length],
    amount: 1200000 + index * 370000,
    isConcluded: index % 3 === 0,
  }));

const COLUMNS = [
  { name: '문서 ID', field: 'id', width: 130 },
  { name: '계약서명', field: 'title', flex: 2, minWidth: 240 },
  { name: '고객', field: 'customer', width: 160 },
  { name: '계약 금액', field: 'amount', width: 160, formatter: (value) => `${Number(value).toLocaleString('ko')}원` },
  {
    name: '체결 여부',
    colId: 'isConcluded',
    width: 130,
    cellRenderer: (contract) => (
      <Badge
        variant="soft"
        size="1"
        color={contract.isConcluded ? 'success' : 'default'}
        text={contract.isConcluded ? '체결완료' : '미체결'}
      />
    ),
  },
];

export const App = () => {
  const user = window.DEMO_USER;
  const [contracts, setContracts] = useState(createContracts);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);

  const pageItems = useMemo(
    () => (limit === BROKEN_LIMIT ? [] : contracts.slice((page - 1) * limit, page * limit)),
    [contracts, page, limit],
  );

  const handleAdd = () => {
    const customer = CUSTOMERS[contracts.length % CUSTOMERS.length];
    setContracts([
      { id: `DOC-${2001 + contracts.length}`, title: `${customer} 신규 계약서`, customer, amount: 2500000, isConcluded: false },
      ...contracts,
    ]);
    setPage(1);
  };

  const handleDelete = () => {
    const selectedIds = selectedItems.map((item) => item.id);
    setContracts(contracts.filter((contract) => !selectedIds.includes(contract.id)));
    setSelectedItems([]);
  };

  return (
    <div className="demoApp">
      <nav className="demoLnb">
        <div className="demoWorkspace">
          <span className="demoWorkspaceLogo">D</span>
          <span className="demoWorkspaceName">데모 주식회사</span>
          <Icon name="CaretUpDown" size={14} />
        </div>
        <button className="demoQuickAction" onClick={handleAdd}>
          <Icon name="Plus" size={16} />
          새로 만들기
        </button>
        <ul className="demoMenus">
          {MENUS.map((menu) => (
            <li key={menu.text} className={menu.text === '전체 계약서' ? 'demoMenu demoMenuSelected' : 'demoMenu'}>
              <Icon name={menu.icon} size={18} />
              {menu.text}
            </li>
          ))}
        </ul>
        <div className="demoProfile">
          <InitialAvatar name={user.name} size="2" />
          <div className="demoProfileText">
            <div className="demoProfileName">{user.name}</div>
            <div className="demoProfileEmail">{user.email}</div>
          </div>
        </div>
      </nav>

      <main className="demoContents">
        <DataGridSection
          title="전체 계약서"
          total={contracts.length}
          pagination={{ page, setPage, limit, setLimit }}
          fixedLeftItems={[<Button key="create" size="2" text="계약서 등록" icon={{ name: 'Plus', position: 'start' }} onClick={handleAdd} />]}
          rightItems={[<Button key="excel" size="2" variant="outline" text="엑셀 다운로드" />]}
        >
          <DataGridLayout
            grid={
              <DataGrid
                items={pageItems}
                columns={COLUMNS}
                rowSelection={{ selectedItems, setSelectedItems }}
                emptyMessage="표시할 계약서가 없습니다."
              />
            }
            floatingActionBar={
              <DataGridFloatingActionBar
                count={selectedItems.length}
                buttons={[{ text: '삭제', isRed: true, onClick: handleDelete }]}
                onClose={() => setSelectedItems([])}
              />
            }
          />
        </DataGridSection>
      </main>
    </div>
  );
};
