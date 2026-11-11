import { useState } from 'react';
import Button from '@lattice-im/design-system/components/buttons/Button/Button';
import Badge from '@lattice-im/design-system/components/data-display/Badge/Badge';
import DataGrid from '@lattice-im/design-system/components/data-display/DataGrid/DataGrid';
import DataGridFloatingActionBar from '@lattice-im/design-system/components/data-display/DataGrid/DataGridFloatingActionBar/DataGridFloatingActionBar';
import Icon from '@lattice-im/design-system/components/data-display/Icon/Icon';
import DataGridLayout from '@lattice-im/design-system/components/layouts/DataGridLayout/DataGridLayout';
import DropDownMenu from '@lattice-im/design-system/components/overlays/DropDownMenu/DropDownMenu';
import DataGridSection from '@lattice-im/design-system/components/layouts/DataGridSection/DataGridSection';

const CUSTOMERS = ['한빛상사', '세라트젠', '오름기획', '누리테크', '다온물산', '가람전자', '미르건설', '새솔유통'];
const MENUS = [
  { icon: 'House', text: '홈' },
  { icon: 'FileText', text: '전체 계약서' },
  { icon: 'FolderSimple', text: '프로젝트' },
  { icon: 'UsersThree', text: '고객' },
  { icon: 'PenNib', text: '전자서명' },
];

const createContracts = () =>
  Array.from({ length: 60 }, (_, index) => ({
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
  const [selectedItems, setSelectedItems] = useState([]);

  const handleAdd = () => {
    const customer = CUSTOMERS[contracts.length % CUSTOMERS.length];
    setContracts([
      { id: `DOC-${2001 + contracts.length}`, title: `${customer} 신규 계약서`, customer, amount: 2500000, isConcluded: false },
      ...contracts,
    ]);
  };

  const handleDelete = () => {
    const selectedIds = selectedItems.map((item) => item.id);
    setContracts(contracts.filter((contract) => !selectedIds.includes(contract.id)));
    setSelectedItems([]);
  };

  return (
    <div className="demoApp">
      <nav className="demoLnb">
        <DropDownMenu
          trigger={
            <div className="demoTrigger">
              <button type="button" className="demoWorkspace">
                <img className="demoWorkspaceLogo" src="./logo-symbol.svg" alt="logo" />
                <span className="demoWorkspaceName">데모 주식회사</span>
                <Icon name="CaretDown" size={11} weight="fill" />
              </button>
            </div>
          }
          color="gray"
          variant="soft"
          weight="regular"
          items={[
            {
              type: 'label',
              content: (
                <div className="demoBusiness">
                  <span className="demoBusinessEmail">{user.email}</span>
                  <div className="demoBusinessRow">
                    <span className="demoBusinessCompany">데모 주식회사</span>
                    <Badge variant="soft" size="1" color="accent" radius="small" text="경영지원팀" />
                  </div>
                  <span className="demoBusinessProfile">{user.name}</span>
                </div>
              ),
            },
            { type: 'separator' },
            { content: '설정' },
            { content: '로그아웃' },
          ]}
        />
        <DropDownMenu
          trigger={
            <div className="demoTrigger">
              <button type="button" className="demoQuickAction">
                <span className="demoQuickActionContents">
                  <Icon name="SelectionPlus" size={16} />
                  새로 만들기
                </span>
                <Icon name="CaretDown" size={11} weight="fill" />
              </button>
            </div>
          }
          items={[{ content: '계약서', onClick: handleAdd }, { content: '프로젝트' }, { content: '고객' }]}
          variant="soft"
          color="gray"
          align="start"
          size="2"
          weight="regular"
          followTriggerWidth
        />
        <ul className="demoMenus">
          {MENUS.map((menu) => (
            <li key={menu.text} className={menu.text === '전체 계약서' ? 'demoMenu demoMenuSelected' : 'demoMenu'}>
              <Icon name={menu.icon} size={18} />
              {menu.text}
            </li>
          ))}
        </ul>
      </nav>

      <main className="demoContents">
        <DataGridSection
          title="전체 계약서"
          total={contracts.length}
          fixedLeftItems={[<Button key="create" size="2" text="계약서 등록" icon={{ name: 'Plus', position: 'start' }} onClick={handleAdd} />]}
          rightItems={[<Button key="excel" size="2" variant="outline" text="엑셀 다운로드" />]}
        >
          <DataGridLayout
            grid={
              <DataGrid
                items={contracts}
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
