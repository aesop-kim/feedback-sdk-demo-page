import { useMemo, useState } from 'react';
import Button from '@lattice-im/design-system/components/buttons/Button/Button';
import Badge from '@lattice-im/design-system/components/data-display/Badge/Badge';
import Profile from '@lattice-im/design-system/components/data-display/Profile/Profile';
import Checkbox from '@lattice-im/design-system/components/inputs/Checkbox/Checkbox';
import Select from '@lattice-im/design-system/components/inputs/Select/Select';
import TextInput from '@lattice-im/design-system/components/inputs/TextInput/TextInput';
import ContentHeader from '@lattice-im/design-system/components/layouts/ContentHeader/ContentHeader';
import LNBLayout from '@lattice-im/design-system/components/layouts/LNBLayout/LNBLayout';
import ListItem from '@lattice-im/design-system/components/navigation/ListItem/ListItem';
import MenuGroup from '@lattice-im/design-system/components/navigation/MenuGroup/MenuGroup';

const CUSTOMERS = ['한빛상사', '세라트젠', '오름기획', '누리테크', '다온물산', '가람전자', '미르건설', '새솔유통'];
const MENUS = [
  { icon: 'SquaresFour', text: '대시보드' },
  { icon: 'FileText', text: '계약서' },
  { icon: 'Folder', text: '프로젝트' },
  { icon: 'Users', text: '고객' },
];
const PAGE_SIZE_OPTIONS = ['5', '10', '100'].map((size) => ({ value: size, label: `${size}개 보기` }));

const createContracts = () =>
  Array.from({ length: 23 }, (_, index) => ({
    id: `DOC-${1001 + index}`,
    title: `${CUSTOMERS[index % CUSTOMERS.length]} 서비스 이용 계약서`,
    customer: CUSTOMERS[index % CUSTOMERS.length],
    amount: 1200000 + index * 370000,
    isConcluded: index % 3 === 0,
  }));

export const App = () => {
  const user = window.DEMO_USER;
  const [collapsed, setCollapsed] = useState(false);
  const [contracts, setContracts] = useState(createContracts);
  const [keyword, setKeyword] = useState('');
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0].value);
  const [selectedIds, setSelectedIds] = useState([]);

  const visibleContracts = useMemo(() => {
    const filtered = contracts.filter((contract) => contract.title.startsWith(keyword.trim()));
    return pageSize === '100' ? [] : filtered.slice(0, Number(pageSize));
  }, [contracts, keyword, pageSize]);

  const handleAdd = () => {
    const customer = CUSTOMERS[contracts.length % CUSTOMERS.length];
    setContracts([
      { id: `DOC-${2001 + contracts.length}`, title: `${customer} 신규 계약서`, customer, amount: 2500000, isConcluded: false },
      ...contracts,
    ]);
  };

  const handleToggle = (id) => {
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((selectedId) => selectedId !== id) : [...selectedIds, id]);
  };

  const handleDelete = () => {
    setContracts(contracts.filter((contract) => !selectedIds.includes(contract.id)));
    setSelectedIds([]);
  };

  return (
    <div className="container">
      <LNBLayout
        logo={
          <div className="logo">
            <span className="logoMark">D</span>
            <span className="logoName">데모 주식회사</span>
          </div>
        }
        control={{ collapsed, setCollapsed }}
        footer={
          <MenuGroup collapsed={collapsed}>
            <ListItem icon="Gear" text="설정" collapsed={collapsed} />
          </MenuGroup>
        }
        profile={<Profile name={user.name} role={user.email} collapsed={collapsed} />}
      >
        <MenuGroup label="메뉴" collapsed={collapsed}>
          {MENUS.map((menu) => (
            <ListItem key={menu.text} icon={menu.icon} text={menu.text} selected={menu.text === '계약서'} collapsed={collapsed} />
          ))}
        </MenuGroup>
      </LNBLayout>

      <main className="contents">
        <div className="headerArea">
        <ContentHeader
          title="계약서"
          buttonSlot={
            <Button leftIcon="Plus" onClick={handleAdd}>
              새로 만들기
            </Button>
          }
        />
        </div>

        <div className="body">
          <div className="toolbar">
            <div className="search">
              <TextInput placeholder="계약서명 검색" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
            </div>
            <div className="toolbarActions">
              <Button variant="outline" color="gray" disabled={!selectedIds.length} onClick={handleDelete}>
                선택 삭제
              </Button>
              <Select options={PAGE_SIZE_OPTIONS} value={pageSize} onValueChange={setPageSize} />
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th className="checkCell" />
                <th>문서 ID</th>
                <th>계약서명</th>
                <th>고객</th>
                <th className="amountCell">계약 금액</th>
                <th>체결 여부</th>
              </tr>
            </thead>
            <tbody>
              {visibleContracts.map((contract) => (
                <tr key={contract.id}>
                  <td className="checkCell">
                    <Checkbox checked={selectedIds.includes(contract.id)} onCheckedChange={() => handleToggle(contract.id)} />
                  </td>
                  <td className="idCell">{contract.id}</td>
                  <td>{contract.title}</td>
                  <td>{contract.customer}</td>
                  <td className="amountCell">{contract.amount.toLocaleString()}원</td>
                  <td>
                    <Badge
                      variant="soft"
                      color={contract.isConcluded ? 'success' : 'gray'}
                      text={contract.isConcluded ? '체결완료' : '미체결'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visibleContracts.length && <p className="empty">표시할 계약서가 없습니다.</p>}
        </div>
      </main>
    </div>
  );
};
