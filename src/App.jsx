import { useMemo, useState } from 'react';

const CUSTOMERS = ['한빛상사', '세라트젠', '오름기획', '누리테크', '다온물산', '가람전자', '미르건설', '새솔유통'];
const MENUS = ['대시보드', '계약서', '프로젝트', '고객', '설정'];
const PAGE_SIZES = [5, 10, 100];

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
  const [contracts, setContracts] = useState(createContracts);
  const [keyword, setKeyword] = useState('');
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [selectedIds, setSelectedIds] = useState([]);

  const visibleContracts = useMemo(() => {
    const filtered = contracts.filter((contract) => contract.title.startsWith(keyword.trim()));
    return pageSize === 100 ? [] : filtered.slice(0, pageSize);
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
      <nav className="lnb">
        <div className="workspace">
          <span className="workspaceLogo">D</span>
          <span className="workspaceName">데모 주식회사</span>
        </div>
        <ul className="menus">
          {MENUS.map((menu) => (
            <li key={menu} className={menu === '계약서' ? 'menu selected' : 'menu'}>
              {menu}
            </li>
          ))}
        </ul>
        <div className="profile">
          <span className="avatar">{user.name.slice(0, 1)}</span>
          <div>
            <div className="profileName">{user.name}</div>
            <div className="profileEmail">{user.email}</div>
          </div>
        </div>
      </nav>

      <main className="contents">
        <header className="header">
          <h1 className="title">계약서</h1>
          <div className="headerActions">
            <input
              className="search"
              placeholder="계약서명 검색"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <button className="button primary" onClick={handleAdd}>
              새로 만들기
            </button>
          </div>
        </header>

        <div className="body">
          <div className="toolbar">
            <span className="count">전체 {contracts.length}건</span>
            <div className="toolbarActions">
              <button className="button" disabled={!selectedIds.length} onClick={handleDelete}>
                선택 삭제
              </button>
              <select className="select" value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
                {PAGE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}개 보기
                  </option>
                ))}
              </select>
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
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(contract.id)}
                      onChange={() => handleToggle(contract.id)}
                    />
                  </td>
                  <td className="idCell">{contract.id}</td>
                  <td>{contract.title}</td>
                  <td>{contract.customer}</td>
                  <td className="amountCell">{contract.amount.toLocaleString()}원</td>
                  <td>
                    <span className={contract.isConcluded ? 'badge concluded' : 'badge'}>
                      {contract.isConcluded ? '체결완료' : '미체결'}
                    </span>
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
